import { store } from "@/app/store";
import { setCallConnected } from "@/features/connect/callSlice";
import { connectWebRTCService } from "../connectWebRTCService";
import { connectAudioManager } from "../connectAudioManager";
import { attachRemoteAudio, cleanupRemoteAudio } from "./callAudioElement";
import { CallType } from "@/types/connect";

export async function initWebRTCForCaller(targetUserId: string, callId: string, type: CallType) {
  try {
    await connectWebRTCService.init({
      targetUserId, callId,
      onRemoteStream: (stream) => { attachRemoteAudio(stream); store.dispatch(setCallConnected({ callId })); },
      onConnectionStateChange: (state) => { if (state === "connected") { connectAudioManager.stopOutgoingCall(); connectAudioManager.playCallConnected(); store.dispatch(setCallConnected({ callId })); } },
    });
    await connectWebRTCService.getLocalMedia(true, type === "video");
    await connectWebRTCService.createOffer();
  } catch {}
}

export async function initWebRTCForReceiver(callerUserId: string, callId: string, type: CallType) {
  try {
    await connectWebRTCService.init({
      targetUserId: callerUserId, callId,
      onRemoteStream: (stream) => { attachRemoteAudio(stream); store.dispatch(setCallConnected({ callId })); },
      onConnectionStateChange: (state) => { if (state === "connected") { connectAudioManager.stopIncomingCall(); store.dispatch(setCallConnected({ callId })); } },
    });
    await connectWebRTCService.getLocalMedia(true, type === "video");
  } catch {}
}

export function cleanupWebRTC() { connectWebRTCService.cleanup(); cleanupRemoteAudio(); }
