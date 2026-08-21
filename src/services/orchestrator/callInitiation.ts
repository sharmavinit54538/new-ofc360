import { store } from "@/app/store";
import { startOutgoingCall } from "@/features/connect/callSlice";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectAudioManager } from "../connectAudioManager";
import { connectApi } from "../api/connectApi";
import { ConnectUser, CallType } from "@/types/connect";
import { toast } from "sonner";
import { initWebRTCForCaller } from "./callWebRTCInit";

export async function initiateOutgoingCall(targetUser: ConnectUser, type: CallType, onStartTimeout: (callId: string) => void): Promise<string | null> {
  const currentUser = store.getState().auth.user;
  const callerId = String(currentUser?.id || currentUser?._id || "");
  if (!callerId || !targetUser?.id) return null;
  if (callerId === String(targetUser.id)) { toast.error("You cannot call yourself."); return null; }
  let callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try { const r = await store.dispatch(connectApi.endpoints.initiateCall.initiate({ calleeId: targetUser.id, targetUserId: targetUser.id, type })).unwrap(); if (r?.callId) callId = r.callId; } catch {}
  store.dispatch(startOutgoingCall({ targetUser, type, callId }));
  connectWebSocketService.send("call:start", { type: "call:start", callId, callerId, receiverId: targetUser.id, callType: type });
  connectWebSocketService.send("call:incoming", { type: "call:incoming", callId, callerId, receiverId: targetUser.id, callType: type });
  connectAudioManager.playOutgoingCall();
  onStartTimeout(callId);
  await initWebRTCForCaller(targetUser.id, callId, type);
  return callId;
}
