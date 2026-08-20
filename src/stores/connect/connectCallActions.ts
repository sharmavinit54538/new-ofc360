import { connectAudioManager } from "@/services/connectAudioManager";

export const createCallActions = (set: any, get: any) => ({
  startCall: (callee: any, type: any) => {
    const call = { id: "CALL-" + Date.now(), callee, type, status: "initiating", startedAt: Date.now() };
    set({ activeCall: call }); connectAudioManager.playOutgoingCall(); return call;
  },
  acceptCall: () => {
    const inc = get().incomingCall; if (!inc) return;
    set({ activeCall: { ...inc, status: "connected" }, incomingCall: null });
    connectAudioManager.stopIncomingCall(); connectAudioManager.playCallConnected();
  },
  rejectCall: () => { set({ incomingCall: null }); connectAudioManager.stopIncomingCall(); },
  endCall: () => { set({ activeCall: null }); connectAudioManager.stopOutgoingCall(); connectAudioManager.playCallEnded(); },
});