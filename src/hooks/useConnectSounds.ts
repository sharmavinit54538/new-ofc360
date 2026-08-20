import { useCallback, useEffect } from "react";
import { useConnectSoundStore, ConnectSoundSettings } from "@/stores/connectSoundStore";
import { connectAudioManager, PlaySoundOptions } from "@/services/connectAudioManager";

export function useConnectSounds() {
  const soundSettings = useConnectSoundStore();

  const unlockAudio = useCallback(async () => {
    return await connectAudioManager.unlockAudio();
  }, []);

  const playIncomingCall = useCallback(() => {
    connectAudioManager.playIncomingCall();
  }, []);

  const stopIncomingCall = useCallback(() => {
    connectAudioManager.stopIncomingCall();
  }, []);

  const playOutgoingCall = useCallback(() => {
    connectAudioManager.playOutgoingCall();
  }, []);

  const stopOutgoingCall = useCallback(() => {
    connectAudioManager.stopOutgoingCall();
  }, []);

  const playMessage = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playMessage(options);
  }, []);

  const playMention = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playMention(options);
  }, []);

  const playCallConnecting = useCallback(() => {
    connectAudioManager.playCallConnecting();
  }, []);

  const playCallConnected = useCallback(() => {
    connectAudioManager.playCallConnected();
  }, []);

  const playCallRejected = useCallback(() => {
    connectAudioManager.playCallRejected();
  }, []);

  const playCallFailed = useCallback(() => {
    connectAudioManager.playCallFailed();
  }, []);

  const playCallEnded = useCallback(() => {
    connectAudioManager.playCallEnded();
  }, []);

  const playBusy = useCallback(() => {
    connectAudioManager.playBusy();
  }, []);

  const playParticipantJoined = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playParticipantJoined(options);
  }, []);

  const playParticipantLeft = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playParticipantLeft(options);
  }, []);

  const playMeetingStarted = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playMeetingStarted(options);
  }, []);

  const playMeetingEnded = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playMeetingEnded(options);
  }, []);

  const playScreenShareStarted = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playScreenShareStarted(options);
  }, []);

  const playScreenShareStopped = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playScreenShareStopped(options);
  }, []);

  const playNotification = useCallback((options?: PlaySoundOptions) => {
    connectAudioManager.playNotification(options);
  }, []);

  const stopAllSounds = useCallback(() => {
    connectAudioManager.stopAllSounds();
  }, []);

  return {
    ...soundSettings,
    unlockAudio,
    playIncomingCall,
    stopIncomingCall,
    playOutgoingCall,
    stopOutgoingCall,
    playMessage,
    playMention,
    playCallConnecting,
    playCallConnected,
    playCallRejected,
    playCallFailed,
    playCallEnded,
    playBusy,
    playParticipantJoined,
    playParticipantLeft,
    playMeetingStarted,
    playMeetingEnded,
    playScreenShareStarted,
    playScreenShareStopped,
    playNotification,
    stopAllSounds,
  };
}