import { store } from "@/app/store";
import {
  setCallConnecting,
  setCallConnected,
  setCallFailed,
} from "@/features/connect/callSlice";
import { connectWebRTCService } from "../connectWebRTCService";
import { connectAudioManager } from "../connectAudioManager";
import { attachRemoteAudio, cleanupRemoteAudio } from "./callAudioElement";
import { CallType } from "@/types/connect";

export async function initWebRTCForCaller(
  targetUserId: string,
  callId: string,
  type: CallType
) {
  try {
    const iceServers = store.getState().connectCall.iceServers;

    connectWebRTCService.init({
      targetUserId,
      callId,
      iceServers,
      onRemoteStream: (stream) => {
        attachRemoteAudio(stream);
        store.dispatch(setCallConnected({ callId }));
      },
      onConnectionStateChange: (state) => {
        const currentCallStatus = store.getState().connectCall.status;
        const isCallingOrRinging =
          currentCallStatus === "OUTGOING_CALLING" ||
          currentCallStatus === "OUTGOING_RINGING" ||
          currentCallStatus === "INCOMING_RINGING" ||
          currentCallStatus === "calling" ||
          currentCallStatus === "ringing";

        if (state === "connecting") {
          // Do NOT override outgoing calling or ringing with connecting until peer accepts
          if (!isCallingOrRinging) {
            store.dispatch(setCallConnecting());
          }
        } else if (state === "connected") {
          connectAudioManager.stopOutgoingCall();
          connectAudioManager.playCallConnected();
          store.dispatch(setCallConnected({ callId }));
        } else if (state === "failed") {
          if (!isCallingOrRinging) {
            connectAudioManager.stopOutgoingCall();
            connectAudioManager.playCallFailed();
            store.dispatch(setCallFailed("Call connection failed"));
          }
        }
      },
    });

    await connectWebRTCService.getLocalMedia(true, type === "video");
    await connectWebRTCService.createOffer();
  } catch (err) {
    console.error("[WEBRTC_CALLER_INIT_ERROR]", err);
  }
}

export async function initWebRTCForReceiver(
  callerUserId: string,
  callId: string,
  type: CallType
) {
  try {
    const iceServers = store.getState().connectCall.iceServers;

    connectWebRTCService.init({
      targetUserId: callerUserId,
      callId,
      iceServers,
      onRemoteStream: (stream) => {
        attachRemoteAudio(stream);
        store.dispatch(setCallConnected({ callId }));
      },
      onConnectionStateChange: (state) => {
        if (state === "connecting") {
          store.dispatch(setCallConnecting());
        } else if (state === "connected") {
          connectAudioManager.stopIncomingCall();
          connectAudioManager.playCallConnected();
          store.dispatch(setCallConnected({ callId }));
        } else if (state === "failed") {
          connectAudioManager.stopIncomingCall();
          connectAudioManager.playCallFailed();
          store.dispatch(setCallFailed("Call connection failed"));
        }
      },
    });

    await connectWebRTCService.getLocalMedia(true, type === "video");
    await connectWebRTCService.createAnswer();
  } catch (err) {
    console.error("[WEBRTC_RECEIVER_INIT_ERROR]", err);
  }
}

export function cleanupWebRTC() {
  connectWebRTCService.cleanup();
  cleanupRemoteAudio();
}
