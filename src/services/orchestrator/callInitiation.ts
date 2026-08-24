import { store } from "@/app/store";
import {
  startOutgoingCall,
  setOutgoingRinging,
} from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectCallsApi } from "../api/connect/connectCallsEndpoints";
import { ConnectUser, CallType } from "@/types/connect";
import { toast } from "sonner";
import { initWebRTCForCaller } from "./callWebRTCInit";

export async function initiateOutgoingCall(
  targetUser: ConnectUser,
  type: CallType,
  onStartTimeout: (callId: string) => void
): Promise<string | null> {
  const currentUser = store.getState().auth.user;
  const callerId = String(currentUser?.id || (currentUser as any)?._id || "");
  if (!callerId || !targetUser?.id) return null;

  if (callerId === String(targetUser.id)) {
    toast.error("You cannot call yourself.");
    return null;
  }

  let callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const r = await store
      .dispatch(
        connectCallsApi.endpoints.initiateCall.initiate({
          calleeId: targetUser.id,
          targetUserId: targetUser.id,
          type,
        })
      )
      .unwrap();
    if (r?.callId) callId = r.callId;
  } catch {}

  store.dispatch(startOutgoingCall({ targetUser, type, callId }));

  const callPayload = {
    type: "call:start",
    callId,
    callerId,
    callerName: currentUser?.name || "Colleague",
    callerAvatar: currentUser?.avatar,
    callerRole: currentUser?.role,
    callerEmail: currentUser?.email,
    receiverId: targetUser.id,
    targetUserId: targetUser.id,
    callType: type,
  };

  connectWebSocketService.send("call:start", callPayload);
  connectWebSocketService.send("call:incoming", callPayload);
  connectWebSocketService.send("call:invite", callPayload);

  connectAudioManager.playOutgoingCall();
  onStartTimeout(callId);

  // Transition from calling -> ringing
  setTimeout(() => {
    const currentStatus = store.getState().connectCall.status;
    if (currentStatus === "OUTGOING_CALLING" || currentStatus === "calling") {
      store.dispatch(setOutgoingRinging());
    }
  }, 1200);

  await initWebRTCForCaller(targetUser.id, callId, type);
  return callId;
}
