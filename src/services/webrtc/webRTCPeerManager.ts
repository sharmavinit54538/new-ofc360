import { WebRTCMediaManager } from "./webRTCMediaManager";
import { WebRTCSignalManager } from "./webRTCSignalManager";
import { createPeerOffer, createPeerAnswer } from "./webRTCOfferAnswer";

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

  public init(config?: WebRTCInitConfig) {
    if (config?.targetUserId) this.targetUserId = config.targetUserId;
    if (config?.callId) this.callId = config.callId;

    if (typeof RTCPeerConnection === "undefined") return;

    const rtcConfig: RTCConfiguration = {
      iceServers: config?.iceServers || [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    try {
      this.pc = new RTCPeerConnection(rtcConfig);

      // Handle Remote Tracks
      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          config?.onRemoteStream?.(event.streams[0]);
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

      // Handle Connection State
      this.pc.onconnectionstatechange = () => {
        if (this.pc) {
          config?.onConnectionStateChange?.(this.pc.connectionState);
        }
      };

      // Handle ICE Connection State fallback
      this.pc.oniceconnectionstatechange = () => {
        if (this.pc) {
          const iceState = this.pc.iceConnectionState;
          if (iceState === "connected" || iceState === "completed") {
            config?.onConnectionStateChange?.("connected");
          } else if (iceState === "failed" || iceState === "disconnected") {
            config?.onConnectionStateChange?.("failed");
          }
        }
      };
    } catch (err) {
      console.error("[WEBRTC_INIT_ERROR]", err);
    }
  }

  public async getLocalMedia(audio = true, video = true): Promise<MediaStream | null> {
    const stream = await this.media.getLocalMedia(audio, video);
    this.localStream = stream;
    if (this.pc && stream) {
      stream.getTracks().forEach((track) => {
        try {
          this.pc?.addTrack(track, stream);
        } catch {}
      });
    }
    return stream;
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
    return this.pc
      ? createPeerOffer(this.pc, this.targetUserId, (s) =>
          this.signal.sendSignal(this.targetUserId, this.callId, s)
        )
      : null;
  }

  public async createAnswer() {
    return this.pc
      ? createPeerAnswer(this.pc, this.targetUserId, (s) =>
          this.signal.sendSignal(this.targetUserId, this.callId, s)
        )
      : null;
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
  }
}
