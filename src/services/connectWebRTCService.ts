import { connectWebSocketService } from "./connectWebSocketService";
import { store } from "@/app/store";
import { connectApi } from "./api/connectApi";

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
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;
  private unsubscribeSignal: (() => void) | null = null;

  public async init(config: WebRTCConfig = {}) {
    this.cleanup();

    this.targetUserId = config.targetUserId || null;
    this.callId = config.callId || null;
    this.onRemoteStreamCallback = config.onRemoteStream || null;
    this.onStateChangeCallback = config.onConnectionStateChange || null;

    console.log(`[WEBRTC_INIT] Initializing RTCPeerConnection (target: ${this.targetUserId}, callId: ${this.callId})`);

    // Fetch dynamic ICE servers if available from store/api
    let iceServers = config.iceServers || DEFAULT_ICE_SERVERS;
    try {
      const state = store.getState();
      if (state.connectCall.iceServers && state.connectCall.iceServers.length > 0) {
        iceServers = state.connectCall.iceServers;
      }
    } catch {}

    if (typeof window === "undefined" || !window.RTCPeerConnection) {
      console.warn("[WEBRTC_INIT] RTCPeerConnection is not supported in this environment");
      return null;
    }

    this.pc = new RTCPeerConnection({ iceServers });
    console.log(`[WEBRTC_INIT] RTCPeerConnection created with ${iceServers.length} ICE server(s)`);

    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.targetUserId) {
        console.log(`[ICE_CANDIDATE_SENT] Sending ICE candidate to ${this.targetUserId}: ${event.candidate.candidate.substring(0, 60)}...`);
        this.sendSignal({
          type: "ice-candidate",
          candidate: event.candidate.toJSON(),
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      console.log(`[WEBRTC_ICE_STATE] ICE connection state: ${this.pc?.iceConnectionState}`);
    };

    this.pc.ontrack = (event) => {
      console.log(`[WEBRTC_TRACK] Remote track received: kind=${event.track.kind}, streams=${event.streams.length}`);
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.onRemoteStreamCallback?.(this.remoteStream);
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc) {
        console.log(`[WEBRTC_STATE] Connection state changed: ${this.pc.connectionState}`);
        this.onStateChangeCallback?.(this.pc.connectionState);
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
    } catch (err) {
      console.warn("Error obtaining user media:", err);
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
      console.warn("Error starting screen share:", err);
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
      console.warn("[WEBRTC_OFFER] Cannot create offer: no RTCPeerConnection");
      return null;
    }
    try {
      console.log("[WEBRTC_OFFER_SENT] Creating SDP offer...");
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await this.pc.setLocalDescription(offer);
      console.log("[WEBRTC_OFFER_SENT] Local description set (offer)");

      if (this.targetUserId) {
        this.sendSignal({
          type: "offer",
          sdp: offer.sdp,
        });
        console.log(`[WEBRTC_OFFER_SENT] Offer sent to ${this.targetUserId} via signaling`);
      }
      return offer;
    } catch (err) {
      console.warn("[WEBRTC_OFFER_SENT] Error creating WebRTC offer:", err);
      return null;
    }
  }

  public async createAnswer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.pc) {
      console.warn("[WEBRTC_ANSWER] Cannot create answer: no RTCPeerConnection");
      return null;
    }
    try {
      console.log("[WEBRTC_ANSWER_SENT] Creating SDP answer...");
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      console.log("[WEBRTC_ANSWER_SENT] Local description set (answer)");

      if (this.targetUserId) {
        this.sendSignal({
          type: "answer",
          sdp: answer.sdp,
        });
        console.log(`[WEBRTC_ANSWER_SENT] Answer sent to ${this.targetUserId} via signaling`);
      }
      return answer;
    } catch (err) {
      console.warn("[WEBRTC_ANSWER_SENT] Error creating WebRTC answer:", err);
      return null;
    }
  }

  public async handleIncomingSignal(payload: any) {
    if (!this.pc || !payload) {
      console.warn("[WEBRTC_SIGNAL] Cannot handle signal: pc or payload missing", { hasPc: !!this.pc, hasPayload: !!payload });
      return;
    }

    try {
      const { signal, type, sdp, candidate } = payload;
      const signalType = signal?.type || type;

      console.log(`[CALL_SIGNAL_RECEIVED] Incoming WebRTC signal: ${signalType}`);

      if (signalType === "offer") {
        console.log("[WEBRTC_SIGNAL] Processing SDP offer, setting remote description...");
        const remoteDesc = new RTCSessionDescription({
          type: "offer",
          sdp: signal?.sdp || sdp,
        });
        await this.pc.setRemoteDescription(remoteDesc);
        console.log("[WEBRTC_SIGNAL] Remote description set (offer). Creating answer...");
        await this.createAnswer();
      } else if (signalType === "answer") {
        console.log("[WEBRTC_SIGNAL] Processing SDP answer, setting remote description...");
        const remoteDesc = new RTCSessionDescription({
          type: "answer",
          sdp: signal?.sdp || sdp,
        });
        await this.pc.setRemoteDescription(remoteDesc);
        console.log("[WEBRTC_SIGNAL] Remote description set (answer). WebRTC negotiation complete.");
      } else if (signalType === "ice-candidate") {
        const candidateData = signal?.candidate || candidate;
        if (candidateData) {
          console.log(`[ICE_CANDIDATE_SENT] Adding remote ICE candidate`);
          await this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
        }
      } else {
        console.warn(`[WEBRTC_SIGNAL] Unknown signal type: ${signalType}`);
      }
    } catch (err) {
      console.warn("[WEBRTC_SIGNAL] Error handling incoming WebRTC signal:", err);
    }
  }

  private sendSignal(signal: { type: "offer" | "answer" | "ice-candidate"; sdp?: string; candidate?: any }) {
    if (!this.targetUserId) return;

    // Send via WebSocket
    const sent = connectWebSocketService.send("webrtc:signal", {
      targetUserId: this.targetUserId,
      callId: this.callId,
      signal,
    });

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

    if (this.unsubscribeSignal) {
      this.unsubscribeSignal();
      this.unsubscribeSignal = null;
    }

    if (this.pc) {
      this.pc.close();
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
