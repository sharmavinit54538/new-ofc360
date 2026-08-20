import { useCallback } from "react";
import { connectAudioManager, PlaySoundOptions } from "@/services/connectAudioManager";

export function useCallSoundActions() {
  const playIncomingCall = useCallback(() => connectAudioManager.playIncomingCall(), []);
  const stopIncomingCall = useCallback(() => connectAudioManager.stopIncomingCall(), []);
  const playOutgoingCall = useCallback(() => connectAudioManager.playOutgoingCall(), []);
  const stopOutgoingCall = useCallback(() => connectAudioManager.stopOutgoingCall(), []);
  const playCallConnecting = useCallback(() => connectAudioManager.playCallConnecting(), []);
  const playCallConnected = useCallback(() => connectAudioManager.playCallConnected(), []);
  const playCallRejected = useCallback(() => connectAudioManager.playCallRejected(), []);
  const playCallFailed = useCallback(() => connectAudioManager.playCallFailed(), []);
  const playCallEnded = useCallback(() => connectAudioManager.playCallEnded(), []);
  const playBusy = useCallback(() => connectAudioManager.playBusy(), []);
  return { playIncomingCall, stopIncomingCall, playOutgoingCall, stopOutgoingCall, playCallConnecting, playCallConnected, playCallRejected, playCallFailed, playCallEnded, playBusy };
}
