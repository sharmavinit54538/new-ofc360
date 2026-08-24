import { store } from "@/app/store";
import { endCall, resetCallState } from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectCallsApi } from "../api/connect/connectCallsEndpoints";
import { cleanupWebRTC } from "./callWebRTCInit";

export async function cancelCallLogic(callIdParam?: string, onClearTimeout?: () => void) {
  const state = store.getState().connectCall;
  const callId = callIdParam || state.activeCall?.id;
  const targetUserId = state.remoteUser?.id;

  onClearTimeout?.();
  connectAudioManager.stopOutgoingCall();
  connectAudioManager.stopIncomingCall();
  connectAudioManager.playCallEnded();

  if (callId) {
    try {
      await store
        .dispatch(
          connectCallsApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "rejected",
          })
        )
        .unwrap();
    } catch {}
  }

  if (targetUserId) {
    const cancelPayload = {
      type: "call:cancel",
      callId,
      targetUserId,
      receiverId: targetUserId,
    };
    connectWebSocketService.send("call:cancel", cancelPayload);
    connectWebSocketService.send("call:cancelled", cancelPayload);
  }

  cleanupWebRTC();
  store.dispatch(endCall());

  setTimeout(() => {
    const currentState = store.getState().connectCall;
    if (currentState.status === "ENDED" || currentState.status === "ended") {
      store.dispatch(resetCallState());
    }
  }, 1200);
}

export async function endActiveCallLogic(onClearTimeout?: () => void) {
  const state = store.getState().connectCall;

  if (
    state.status === "OUTGOING_CALLING" ||
    state.status === "OUTGOING_RINGING" ||
    state.status === "INCOMING_RINGING" ||
    state.status === "calling" ||
    state.status === "ringing"
  ) {
    await cancelCallLogic(state.activeCall?.id, onClearTimeout);
    return;
  }

  onClearTimeout?.();
  connectAudioManager.stopIncomingCall();
  connectAudioManager.stopOutgoingCall();
  connectAudioManager.playCallEnded();

  const callId = state.activeCall?.id;
  const targetUserId = state.remoteUser?.id;
  const finalDuration = state.duration;

  if (callId) {
    try {
      await store
        .dispatch(
          connectCallsApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "ended",
            duration: finalDuration,
          })
        )
        .unwrap();
    } catch {}
  }

  if (targetUserId) {
    const endPayload = {
      type: "call:ended",
      callId,
      targetUserId,
      receiverId: targetUserId,
      duration: finalDuration,
    };
    connectWebSocketService.send("call:ended", endPayload);
    connectWebSocketService.send("call:end", endPayload);
  }

  cleanupWebRTC();
  store.dispatch(endCall());

  setTimeout(() => {
    const currentState = store.getState().connectCall;
    if (currentState.status === "ENDED" || currentState.status === "ended") {
      store.dispatch(resetCallState());
    }
  }, 2000);
}
