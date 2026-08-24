import { WebRTCMediaManager } from "./webRTCMediaManager";
import { WebRTCSignalManager } from "./webRTCSignalManager";
import { createPeerOffer, createPeerAnswer } from "./webRTCOfferAnswer";
import { connectWebSocketService } from "../connectWebSocketService";

export interface WebRTCInitConfig {
  targetUserId?: string;
  callId?: string;
  iceServers?: RTCIceServer[];
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

export class ConnectWebRTCService {
  public pc: RTCPeerConnection | null = null;
  public media = new WebRTCMediaManager();
  public signal = new WebRTCSignalManager();
  public targetUserId: string | null = null;
  public callId: string | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;
  public pendingRemoteOffer: RTCSessionDescriptionInit | null = null;
  private signalUnsub: (() => void) | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectionStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;

  constructor() {
    // Global signal listener binding to never miss incoming offers
    this.signalUnsub = connectWebSocketService.onSignal((payload: any) => {
      this.handleIncomingSignal(payload);
    });
  }

  public init(config?: WebRTCInitConfig) {
    if (config?.targetUserId) this.targetUserId = config.targetUserId;
    if (config?.callId) this.callId = config.callId;
    if (config?.onRemoteStream) this.onRemoteStreamCallback = config.onRemoteStream;
    if (config?.onConnectionStateChange) this.onConnectionStateChangeCallback = config.onConnectionStateChange;

    if (typeof RTCPeerConnection === "undefined") return;

    if (this.pc) {
      try {
        this.pc.close();
      } catch {}
      this.pc = null;
    }

    const rtcConfig: RTCConfiguration = {
      iceServers: config?.iceServers || [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
      iceCandidatePoolSize: 10,
    };

    try {
      this.pc = new RTCPeerConnection(rtcConfig);

      // Handle Remote Audio/Video Tracks
      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.onRemoteStreamCallback?.(event.streams[0]);
        } else if (event.track) {
          if (!this.remoteStream) {
            this.remoteStream = new MediaStream();
          }
          this.remoteStream.addTrack(event.track);
          this.onRemoteStreamCallback?.(this.remoteStream);
        }
      };

      // Handle ICE Candidates
      this.pc.onicecandidate = (event) => {
        if (event.candidate && this.targetUserId) {
          this.signal.sendSignal(this.targetUserId, this.callId, {
            type: "ice-candidate",
            candidate: event.candidate,
          });
        }
      };

      // Handle Peer Connection State Changes
      this.pc.onconnectionstatechange = () => {
        if (this.pc) {
          this.onConnectionStateChangeCallback?.(this.pc.connectionState);
        }
      };

      // Handle ICE Connection State fallback
      this.pc.oniceconnectionstatechange = () => {
        if (this.pc) {
          const iceState = this.pc.iceConnectionState;
          if (iceState === "connected" || iceState === "completed") {
            this.onConnectionStateChangeCallback?.("connected");
          } else if (iceState === "failed" || iceState === "disconnected") {
            this.onConnectionStateChangeCallback?.("failed");
          }
        }
      };

      // Ensure signal subscription is active
      if (!this.signalUnsub) {
        this.signalUnsub = connectWebSocketService.onSignal((payload: any) => {
          this.handleIncomingSignal(payload);
        });
      }
    } catch (err) {
      console.error("[WEBRTC_INIT_ERROR]", err);
    }
  }

  public async handleIncomingSignal(payload: any) {
    try {
      const sig = payload?.signal || payload;
      if (!sig) return;

      const sigType = sig.type;

      // 1. Handling SDP Offer (Receiver side)
      if (sigType === "offer" || (sig.sdp && sigType !== "answer")) {
        const sdp = typeof sig.sdp === "string" ? sig.sdp : typeof sig === "string" ? sig : sig.sdp;
        const offerInit: RTCSessionDescriptionInit = { type: "offer", sdp };

        if (this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription(offerInit));
          await this.signal.flushIceCandidates(this.pc);
          await this.createAnswer();
        } else {
          // Buffer offer until receiver answers
          this.pendingRemoteOffer = offerInit;
        }
      }

      // 2. Handling SDP Answer (Caller side)
      else if (sigType === "answer" || (sig.sdp && this.pc?.signalingState === "have-local-offer")) {
        const sdp = typeof sig.sdp === "string" ? sig.sdp : typeof sig === "string" ? sig : sig.sdp;
        if (this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp }));
          await this.signal.flushIceCandidates(this.pc);
        }
      }

      // 3. Handling ICE Candidates
      else if (sigType === "ice-candidate" || sig.candidate || payload.candidate) {
        const candidateData = sig.candidate || payload.candidate || sig;
        if (candidateData && candidateData.candidate) {
          if (this.pc && this.pc.remoteDescription) {
            try {
              await this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
            } catch (err) {
              console.warn("[WEBRTC_ICE_CANDIDATE_ADD]", err);
            }
          } else {
            this.signal.iceCandidateQueue.push(candidateData);
          }
        }
      }

      // 4. Offer Re-request from Receiver
      else if (sigType === "request_offer" || payload.type === "webrtc:request_offer") {
        this.resendOffer();
      }
    } catch (err) {
      console.error("[WEBRTC_SIGNAL_HANDLE_ERROR]", err);
    }
  }

  public async getLocalMedia(audio = true, video = true): Promise<MediaStream | null> {
    const stream = await this.media.getLocalMedia(audio, video);
    this.localStream = stream;
    if (this.pc && stream) {
      const senders = this.pc.getSenders();
      stream.getTracks().forEach((track) => {
        const existingSender = senders.find((s) => s.track?.kind === track.kind);
        if (existingSender) {
          try {
            existingSender.replaceTrack(track);
          } catch {}
        } else {
          try {
            this.pc?.addTrack(track, stream);
          } catch (err) {
            console.error("[WEBRTC_ADD_TRACK_ERROR]", err);
          }
        }
      });
    }
    return stream;
  }

  public resendOffer() {
    if (this.pc && this.pc.localDescription) {
      this.signal.sendSignal(this.targetUserId, this.callId, {
        type: "offer",
        sdp: this.pc.localDescription.sdp,
      });
    }
  }

  public requestOffer() {
    if (this.targetUserId) {
      this.signal.sendSignal(this.targetUserId, this.callId, {
        type: "request_offer",
      });
    }
  }

  public async processPendingOffer(): Promise<boolean> {
    if (this.pc && this.pendingRemoteOffer) {
      try {
        await this.pc.setRemoteDescription(new RTCSessionDescription(this.pendingRemoteOffer));
        this.pendingRemoteOffer = null;
        await this.signal.flushIceCandidates(this.pc);
        await this.createAnswer();
        return true;
      } catch (err) {
        console.error("[WEBRTC_PROCESS_PENDING_OFFER_ERROR]", err);
      }
    }
    return false;
  }

  public async startScreenShare() {
    return this.media.startScreenShare();
  }

  public stopScreenShare() {
    this.media.stopScreenShare();
  }

  public toggleMicrophone(enabled: boolean) {
    this.media.toggleMicrophone(enabled);
  }

  public toggleCamera(enabled: boolean) {
    this.media.toggleCamera(enabled);
  }

  public async createOffer() {
    if (!this.pc) return null;
    return createPeerOffer(this.pc, this.targetUserId, (s) =>
      this.signal.sendSignal(this.targetUserId, this.callId, s)
    );
  }

  public async createAnswer() {
    if (!this.pc) return null;
    return createPeerAnswer(this.pc, this.targetUserId, (s) =>
      this.signal.sendSignal(this.targetUserId, this.callId, s)
    );
  }

  public cleanup() {
    this.media.stopLocalMedia();
    this.media.stopScreenShare();
    if (this.pc) {
      try {
        this.pc.close();
      } catch {}
      this.pc = null;
    }
    this.localStream = null;
    this.remoteStream = null;
    this.targetUserId = null;
    this.callId = null;
    this.pendingRemoteOffer = null;
    this.signal.iceCandidateQueue = [];
    this.onRemoteStreamCallback = null;
    this.onConnectionStateChangeCallback = null;
  }
}
