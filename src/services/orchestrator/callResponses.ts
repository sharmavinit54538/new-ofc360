import { store } from "@/app/store";
import {
  acceptIncomingCall,
  rejectIncomingCall,
  resetCallState,
} from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectCallsApi } from "../api/connect/connectCallsEndpoints";
import { ActiveCall } from "@/types/connect";
import { initWebRTCForReceiver } from "./callWebRTCInit";

export async function acceptCallLogic(call: ActiveCall, onClearTimeout: () => void) {
  if (!call) return;
  onClearTimeout();

  connectAudioManager.stopIncomingCall();
  connectAudioManager.playCallConnected();

  if (call.id) {
    try {
      await store
        .dispatch(
          connectCallsApi.endpoints.updateCallStatus.initiate({
            callId: call.id,
            status: "connected",
          })
        )
        .unwrap();
    } catch {}
  }

  store.dispatch(acceptIncomingCall());

  const currentUserId = store.getState().auth.user?.id;
  const callerId = call.targetUser?.id || call.caller?.id;

  const acceptPayload = {
    type: "call:accepted",
    callId: call.id,
    callerId,
    receiverId: currentUserId,
    targetUserId: callerId,
  };

  connectWebSocketService.send("call:accepted", acceptPayload);
  connectWebSocketService.send("call:accept", acceptPayload);

  if (callerId) {
    await initWebRTCForReceiver(callerId, call.id, call.type || "audio");
  }
}

export async function rejectCallLogic(call: ActiveCall, onClearTimeout: () => void) {
  if (!call) return;
  onClearTimeout();

  connectAudioManager.stopIncomingCall();
  connectAudioManager.playCallRejected();

  if (call.id) {
    try {
      await store
        .dispatch(
          connectCallsApi.endpoints.updateCallStatus.initiate({
            callId: call.id,
            status: "rejected",
          })
        )
        .unwrap();
    } catch {}
  }

  store.dispatch(rejectIncomingCall());

  const callerId = call.targetUser?.id || call.caller?.id;
  const rejectPayload = {
    type: "call:rejected",
    callId: call.id,
    callerId,
    targetUserId: callerId,
    reason: "declined",
  };

  connectWebSocketService.send("call:rejected", rejectPayload);
  connectWebSocketService.send("call:declined", rejectPayload);

  setTimeout(() => {
    const state = store.getState().connectCall;
    if (state.status === "DECLINED" || state.status === "declined") {
      store.dispatch(resetCallState());
    }
  }, 1000);
}
