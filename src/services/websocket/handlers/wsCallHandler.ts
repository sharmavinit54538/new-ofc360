import { store } from "@/app/store";
import {
  receiveIncomingCall,
  setOutgoingRinging,
  setCallConnecting,
  setCallConnected,
  setCallDeclined,
  setCallMissed,
  endCall,
  resetCallState,
} from "@/features/connect/callSlice";
import { connectAudioManager } from "@/services/connectAudioManager";
import { connectWebRTCService } from "@/services/connectWebRTCService";
import { toast } from "sonner";

export function handleWsCallEvent(
  eventType: string,
  data: any,
  signalListeners: Set<(p: any) => void>
) {
  const currentUserId = store.getState().auth.user?.id;

  // 1. Incoming Call Event
  if (
    eventType === "call:incoming" ||
    eventType === "call:start" ||
    eventType === "call:invite"
  ) {
    const caller = data.caller || {
      id: data.callerId || data.caller_id,
      name: data.callerName || "Colleague",
      email: data.callerEmail || "",
      avatar: data.callerAvatar,
    };
    const callType = data.callType || data.type || "audio";
    const callId = data.callId || data.call_id || `call_${Date.now()}`;

    // Don't ring if the caller is the current user
    if (String(caller.id) === String(currentUserId)) return;

    store.dispatch(receiveIncomingCall({ caller, type: callType, callId }));
    connectAudioManager.playIncomingCall();
  }

  // 2. Remote peer is ringing
  else if (eventType === "call:ringing") {
    store.dispatch(setOutgoingRinging());
  }

  // 3. Remote peer accepted call
  else if (eventType === "call:accepted" || eventType === "call:accept") {
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.playCallConnected();
    store.dispatch(setCallConnecting());
    connectWebRTCService.resendOffer();
    const callId = data.callId || data.call_id;
    setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "CONNECTING" || state.status === "connecting") {
        store.dispatch(setCallConnected({ callId }));
      }
    }, 2000);
  }

  // 4. Remote peer declined/rejected call
  else if (
    eventType === "call:rejected" ||
    eventType === "call:reject" ||
    eventType === "call:declined"
  ) {
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.stopIncomingCall();
    connectAudioManager.playCallRejected();
    store.dispatch(setCallDeclined());
    toast.info("Call declined");
    setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "DECLINED" || state.status === "declined") {
        store.dispatch(resetCallState());
      }
    }, 2500);
  }

  // 5. Caller cancelled before answer
  else if (eventType === "call:cancel" || eventType === "call:cancelled") {
    connectAudioManager.stopIncomingCall();
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.playCallEnded();
    store.dispatch(endCall());
    setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "ENDED" || state.status === "ended") {
        store.dispatch(resetCallState());
      }
    }, 1500);
  }

  // 6. Call ended
  else if (eventType === "call:ended" || eventType === "call:end") {
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.stopIncomingCall();
    connectAudioManager.playCallEnded();
    store.dispatch(endCall());
    setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "ENDED" || state.status === "ended") {
        store.dispatch(resetCallState());
      }
    }, 2000);
  }

  // 7. Missed Call
  else if (eventType === "call:missed") {
    connectAudioManager.stopIncomingCall();
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.playCallFailed();
    store.dispatch(setCallMissed());
    toast.info("Missed call");
    setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "MISSED" || state.status === "missed") {
        store.dispatch(resetCallState());
      }
    }, 2500);
  }

  // 8. WebRTC Signaling Data
  else if (eventType === "webrtc:signal") {
    signalListeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error("[WEBRTC_SIGNAL_ERROR]", err);
      }
    });
  }
}
