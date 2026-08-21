import { store } from "@/app/store";
import { acceptIncomingCall, rejectIncomingCall, endCall } from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectApi } from "../api/connectApi";
import { ActiveCall } from "@/types/connect";
import { initWebRTCForReceiver, cleanupWebRTC } from "./callWebRTCInit";

export async function acceptCallLogic(call: ActiveCall, onClearTimeout: () => void) {
  if (!call) return;
  onClearTimeout();
  connectAudioManager.stopIncomingCall(); connectAudioManager.playCallConnected();
  if (call.id) try { await store.dispatch(connectApi.endpoints.updateCallStatus.initiate({ callId: call.id, status: "connected" })).unwrap(); } catch {}
  store.dispatch(acceptIncomingCall());
  connectWebSocketService.send("call:accepted", { type: "call:accepted", callId: call.id, callerId: call.targetUser?.id, receiverId: store.getState().auth.user?.id });
  if (call.targetUser?.id) await initWebRTCForReceiver(call.targetUser.id, call.id, call.type);
}

export async function rejectCallLogic(call: ActiveCall, onClearTimeout: () => void) {
  if (!call) return;
  onClearTimeout();
  connectAudioManager.stopIncomingCall(); connectAudioManager.playCallRejected();
  if (call.id) try { await store.dispatch(connectApi.endpoints.updateCallStatus.initiate({ callId: call.id, status: "rejected" })).unwrap(); } catch {}
  store.dispatch(rejectIncomingCall());
  connectWebSocketService.send("call:rejected", { type: "call:rejected", callId: call.id, callerId: call.targetUser?.id });
}
