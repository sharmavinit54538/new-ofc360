import { WebRTCMediaManager } from "./webRTCMediaManager";
import { WebRTCSignalManager } from "./webRTCSignalManager";
import { createPeerOffer, createPeerAnswer } from "./webRTCOfferAnswer";

export class ConnectWebRTCService {
  public pc: RTCPeerConnection | null = null;
  public media = new WebRTCMediaManager();
  public signal = new WebRTCSignalManager();
  public targetUserId: string | null = null;
  public callId: string | null = null;
  public remoteStream: MediaStream | null = null;

  public init(_config?: any) { if (typeof RTCPeerConnection !== "undefined") this.pc = new RTCPeerConnection(_config); }
  public async getLocalMedia(a = true, v = true) { const s = await this.media.getLocalMedia(a, v); if (this.pc && s) s.getTracks().forEach((t) => this.pc?.addTrack(t, s)); return s; }
  public async startScreenShare() { return this.media.startScreenShare(); }
  public stopScreenShare() { this.media.stopScreenShare(); }
  public toggleMicrophone(enabled: boolean) { this.media.toggleMicrophone(enabled); }
  public toggleCamera(enabled: boolean) { this.media.toggleCamera(enabled); }
  public async createOffer() { return this.pc ? createPeerOffer(this.pc, this.targetUserId, (s) => this.signal.sendSignal(this.targetUserId, this.callId, s)) : null; }
  public async createAnswer() { return this.pc ? createPeerAnswer(this.pc, this.targetUserId, (s) => this.signal.sendSignal(this.targetUserId, this.callId, s)) : null; }
  public cleanup() { this.media.stopLocalMedia(); this.media.stopScreenShare(); if (this.pc) { try { this.pc.close(); } catch {} this.pc = null; } this.remoteStream = null; }
}
