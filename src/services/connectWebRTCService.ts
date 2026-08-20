import { connectWebSocketService } from "./connectWebSocketService";
import { store } from "@/app/store";
import { connectApi } from "./api/connectApi";
import { toast } from "sonner";

export interface WebRTCConfig {
  iceServers?: RTCIceServer[];
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  targetUserId?: string;
  callId?: string;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

class ConnectWebRTCService {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private targetUserId: string | null = null;
  private callId: string | null = null;
  private iceCandidateQueue: RTCIceCandidateInit[] = [];
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;
  private unsubscribeSignal: (() => void) | null = null;

  public async init(config: WebRTCConfig = {}) {
    this.cleanup();

    this.targetUserId = config.targetUserId || null;
    this.callId = config.callId || null;
    this.onRemoteStreamCallback = config.onRemoteStream || null;
    this.onStateChangeCallback = config.onConnectionStateChange || null;
    this.iceCandidateQueue = [];

    console.log(`[WEBRTC] init RTCPeerConnection (target: ${this.targetUserId}, callId: ${this.callId})`);

    // Fetch dynamic ICE servers if available from store/api
    let iceServers = config.iceServers || DEFAULT_ICE_SERVERS;
    try {
      const state = store.getState();
      if (state.connectCall.iceServers && state.connectCall.iceServers.length > 0) {
        iceServers = state.connectCall.iceServers;
      }
    } catch {}

    if (typeof window === "undefined" || !window.RTCPeerConnection) {
      console.warn("[WEBRTC] RTCPeerConnection is not supported in this environment");
      return null;
    }

    this.pc = new RTCPeerConnection({ iceServers });
    console.log(`[WEBRTC] RTCPeerConnection created with ${iceServers.length} ICE server(s)`);

    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.targetUserId) {
        console.log(`[WEBRTC] ICE candidate generated for ${this.targetUserId}`);
        this.sendSignal({
          type: "ice-candidate",
          candidate: event.candidate.toJSON(),
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      console.log(`[WEBRTC] ICE connection state: ${this.pc?.iceConnectionState}`);
      if (this.pc?.iceConnectionState === "failed") {
        console.warn("[WEBRTC] failed ICE connection");
      }
    };

    this.pc.ontrack = (event) => {
      console.log(`[WEBRTC] Remote track received: kind=${event.track.kind}, streams=${event.streams.length}`);
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.onRemoteStreamCallback?.(this.remoteStream);
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc) {
        const state = this.pc.connectionState;
        if (state === "connected") {
          console.log(`[WEBRTC] connected`);
        } else if (state === "failed") {
          console.warn(`[WEBRTC] failed`);
        } else {
          console.log(`[WEBRTC] connection state: ${state}`);
        }
        this.onStateChangeCallback?.(state);
      }
    };

    // Listen to incoming WebSocket signals
    this.unsubscribeSignal = connectWebSocketService.onSignal((payload) => {
      this.handleIncomingSignal(payload);
    });

    return this.pc;
  }

  public async getLocalMedia(audio = true, video = true): Promise<MediaStream | null> {
    try {
      if (this.localStream) {
        this.stopLocalMedia();
      }

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: audio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false,
        video: video ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } } : false,
      });

      if (this.pc && this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.pc?.addTrack(track, this.localStream!);
        });
      }

      return this.localStream;
    } catch (err: any) {
      console.warn("[WEBRTC] Error obtaining user media:", err);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        toast.error(
          video
            ? "Camera and microphone permissions are required to make this call."
            : "Microphone permission is required to make this call."
        );
      } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
        toast.error("No microphone or camera device detected on this system.");
      }
      return null;
    }
  }

  public async startScreenShare(): Promise<MediaStream | null> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const videoTrack = this.screenStream.getVideoTracks()[0];
      if (this.pc && videoTrack) {
        const senders = this.pc.getSenders();
        const videoSender = senders.find((s) => s.track?.kind === "video");
        if (videoSender) {
          await videoSender.replaceTrack(videoTrack);
        } else {
          this.pc.addTrack(videoTrack, this.screenStream);
        }

        videoTrack.onended = () => {
          this.stopScreenShare();
        };
      }

      return this.screenStream;
    } catch (err) {
      console.warn("[WEBRTC] Error starting screen share:", err);
      return null;
    }
  }

  public async stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }

    if (this.pc && this.localStream) {
      const localVideoTrack = this.localStream.getVideoTracks()[0];
      if (localVideoTrack) {
        const senders = this.pc.getSenders();
        const videoSender = senders.find((s) => s.track?.kind === "video");
        if (videoSender) {
          await videoSender.replaceTrack(localVideoTrack);
        }
      }
    }
  }

  public async createOffer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.pc) {
      console.warn("[WEBRTC] Cannot create offer: no RTCPeerConnection");
      return null;
    }
    try {
      console.log("[WEBRTC] offer creating...");
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await this.pc.setLocalDescription(offer);
      console.log("[WEBRTC] offer local description set");

      if (this.targetUserId) {
        this.sendSignal({
          type: "offer",
          sdp: offer.sdp,
        });
        console.log(`[WEBRTC] offer sent to ${this.targetUserId}`);
      }
      return offer;
    } catch (err) {
      console.warn("[WEBRTC] Error creating offer:", err);
      return null;
    }
  }

  public async createAnswer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.pc) {
      console.warn("[WEBRTC] Cannot create answer: no RTCPeerConnection");
      return null;
    }
    try {
      console.log("[WEBRTC] answer creating...");
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      console.log("[WEBRTC] answer local description set");

      if (this.targetUserId) {
        this.sendSignal({
          type: "answer",
          sdp: answer.sdp,
        });
        console.log(`[WEBRTC] answer sent to ${this.targetUserId}`);
      }
      return answer;
    } catch (err) {
      console.warn("[WEBRTC] Error creating answer:", err);
      return null;
    }
  }

  public async handleIncomingSignal(payload: any) {
    if (!this.pc || !payload) {
      return;
    }

    // Match call_id if both are present
    const payloadCallId = String(payload.call_id || payload.callId || "");
    if (this.callId && payloadCallId && this.callId !== payloadCallId) {
      console.log(`[WEBRTC] Ignoring signal for different callId (${payloadCallId} != ${this.callId})`);
      return;
    }

    try {
      const { signal, type, sdp, candidate } = payload;
      const signalType = signal?.type || type;

      if (signalType === "offer") {
        console.log("[WEBRTC] offer received, setting remote description...");
        const remoteDesc = new RTCSessionDescription({
          type: "offer",
          sdp: signal?.sdp || sdp,
        });
        await this.pc.setRemoteDescription(remoteDesc);
        console.log("[WEBRTC] offer remote description set. Flushing queued ICE candidates...");
        await this.flushIceCandidateQueue();
        await this.createAnswer();
      } else if (signalType === "answer") {
        console.log("[WEBRTC] answer received, setting remote description...");
        const remoteDesc = new RTCSessionDescription({
          type: "answer",
          sdp: signal?.sdp || sdp,
        });
        await this.pc.setRemoteDescription(remoteDesc);
        console.log("[WEBRTC] answer remote description set. Flushing queued ICE candidates...");
        await this.flushIceCandidateQueue();
      } else if (signalType === "ice-candidate") {
        const candidateData = signal?.candidate || candidate;
        if (candidateData) {
          if (this.pc.remoteDescription && this.pc.remoteDescription.type) {
            console.log(`[WEBRTC] ICE candidate added`);
            await this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
          } else {
            console.log(`[WEBRTC] ICE candidate queued (remote description pending)`);
            this.iceCandidateQueue.push(candidateData);
          }
        }
      }
    } catch (err) {
      console.warn("[WEBRTC] Error handling incoming signal:", err);
    }
  }

  private async flushIceCandidateQueue() {
    if (!this.pc) return;
    while (this.iceCandidateQueue.length > 0) {
      const candidateData = this.iceCandidateQueue.shift();
      if (candidateData) {
        try {
          await this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
          console.log("[WEBRTC] Flushed queued ICE candidate");
        } catch (e) {
          console.warn("[WEBRTC] Failed to add queued ICE candidate:", e);
        }
      }
    }
  }

  private sendSignal(signal: { type: "offer" | "answer" | "ice-candidate"; sdp?: string; candidate?: any }) {
    if (!this.targetUserId) return;

    const payload = {
      type: "webrtc:signal",
      targetUserId: this.targetUserId,
      receiver_id: this.targetUserId,
      callId: this.callId,
      call_id: this.callId,
      signal,
    };

    // Send via WebSocket
    const sent = connectWebSocketService.send("webrtc:signal", payload);

    // Fallback via HTTP if WebSocket is offline
    if (!sent && this.callId) {
      store.dispatch(
        connectApi.endpoints.sendCallSignal.initiate({
          callId: this.callId,
          targetUserId: this.targetUserId,
          signal,
        })
      );
    }
  }

  public toggleMicrophone(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((t) => {
        t.enabled = enabled;
      });
    }
  }

  public toggleCamera(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((t) => {
        t.enabled = enabled;
      });
    }
  }

  private stopLocalMedia() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
  }

  public cleanup() {
    this.stopLocalMedia();
    this.stopScreenShare();

    this.iceCandidateQueue = [];

    if (this.unsubscribeSignal) {
      this.unsubscribeSignal();
      this.unsubscribeSignal = null;
    }

    if (this.pc) {
      try {
        this.pc.close();
      } catch {}
      this.pc = null;
    }

    this.remoteStream = null;
    this.targetUserId = null;
    this.callId = null;
    this.onRemoteStreamCallback = null;
    this.onStateChangeCallback = null;
  }
}

export const connectWebRTCService = new ConnectWebRTCService();