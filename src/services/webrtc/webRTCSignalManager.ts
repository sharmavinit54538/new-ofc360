import { connectWebSocketService } from "../connectWebSocketService";
import { store } from "@/app/store";
import { connectCallsApi } from "../api/connect/connectCallsEndpoints";

export class WebRTCSignalManager {
  public iceCandidateQueue: RTCIceCandidateInit[] = [];

  public sendSignal(targetUserId: string | null, callId: string | null, signal: { type: string; sdp?: string; candidate?: any }) {
    if (!targetUserId) return;
    const payload = { type: "webrtc:signal", targetUserId, receiver_id: targetUserId, callId, call_id: callId, signal };
    const sent = connectWebSocketService.send("webrtc:signal", payload);
    if (!sent && callId) store.dispatch(connectCallsApi.endpoints.sendCallSignal.initiate({ callId, targetUserId, signal } as any));
  }

  public async flushIceCandidates(pc: RTCPeerConnection | null) {
    if (!pc) return;
    while (this.iceCandidateQueue.length > 0) {
      const c = this.iceCandidateQueue.shift();
      if (c) try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
  }
}
