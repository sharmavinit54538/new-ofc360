import { store } from "@/app/store";
import { receiveIncomingCall, setCallConnected, endCall } from "@/features/connect/callSlice";
import { connectAudioManager } from "@/services/connectAudioManager";

export function handleWsCallEvent(eventType: string, data: any, signalListeners: Set<(p: any) => void>) {
  if (eventType === "call:incoming" || eventType === "call:start") {
    store.dispatch(receiveIncomingCall({ caller: data.caller || { id: data.callerId, name: "Colleague", email: "" }, type: data.callType || "audio", callId: data.callId }));
    connectAudioManager.playIncomingCall();
  } else if (eventType === "call:accepted") {
    connectAudioManager.stopOutgoingCall(); connectAudioManager.playCallConnected(); store.dispatch(setCallConnected({ callId: data.callId }));
  } else if (eventType === "call:rejected" || eventType === "call:ended" || eventType === "call:cancel") {
    connectAudioManager.stopOutgoingCall(); connectAudioManager.stopIncomingCall(); connectAudioManager.playCallEnded(); store.dispatch(endCall());
  } else if (eventType === "webrtc:signal") {
    signalListeners.forEach((l) => l(data));
  }
}
