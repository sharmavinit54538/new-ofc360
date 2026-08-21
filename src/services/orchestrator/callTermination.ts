import { store } from "@/app/store";
import { endCall } from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectApi } from "../api/connectApi";
import { cleanupWebRTC } from "./callWebRTCInit";

export async function cancelCallLogic(callIdParam?: string, onClearTimeout?: () => void) {
  const state = store.getState().connectCall;
  const callId = callIdParam || state.activeCall?.id;
  const targetUserId = state.remoteUser?.id;
  onClearTimeout?.();
  connectAudioManager.stopOutgoingCall(); connectAudioManager.stopIncomingCall(); connectAudioManager.playCallEnded();
  if (callId) try { await store.dispatch(connectApi.endpoints.updateCallStatus.initiate({ callId, status: "rejected" })).unwrap(); } catch {}
  if (targetUserId) connectWebSocketService.send("call:cancel", { type: "call:cancel", callId, targetUserId });
  cleanupWebRTC();
  store.dispatch(endCall());
}

export async function endActiveCallLogic(onClearTimeout?: () => void) {
  const state = store.getState().connectCall;
  if (state.status === "calling" || state.status === "ringing") { await cancelCallLogic(state.activeCall?.id, onClearTimeout); return; }
  onClearTimeout?.();
  connectAudioManager.stopIncomingCall(); connectAudioManager.stopOutgoingCall(); connectAudioManager.playCallEnded();
  if (state.activeCall?.id) try { await store.dispatch(connectApi.endpoints.updateCallStatus.initiate({ callId: state.activeCall.id, status: "ended", duration: state.duration })).unwrap(); } catch {}
  if (state.remoteUser?.id) connectWebSocketService.send("call:ended", { type: "call:ended", callId: state.activeCall?.id, targetUserId: state.remoteUser.id });
  cleanupWebRTC();
  store.dispatch(endCall());
}
