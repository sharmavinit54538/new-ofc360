import { useCallback } from "react";
import { connectAudioManager, PlaySoundOptions } from "@/services/connectAudioManager";

export function useMeetingSoundActions() {
  const playMessage = useCallback((opts?: PlaySoundOptions) => connectAudioManager.playMessage(opts), []);
  const playMention = useCallback((opts?: PlaySoundOptions) => connectAudioManager.playMention(opts), []);
  const playParticipantJoined = useCallback((opts?: PlaySoundOptions) => connectAudioManager.playParticipantJoined(opts), []);
  const playParticipantLeft = useCallback((opts?: PlaySoundOptions) => connectAudioManager.playParticipantLeft(opts), []);
  const playMeetingStart = useCallback(() => connectAudioManager.playMeetingStart(), []);
  const playMeetingEnd = useCallback(() => connectAudioManager.playMeetingEnd(), []);
  const playScreenShareStart = useCallback(() => connectAudioManager.playScreenShareStart(), []);
  const playScreenShareStop = useCallback(() => connectAudioManager.playScreenShareStop(), []);
  const unlockAudio = useCallback(() => connectAudioManager.unlockAudio(), []);
  return { playMessage, playMention, playParticipantJoined, playParticipantLeft, playMeetingStart, playMeetingEnd, playScreenShareStart, playScreenShareStop, unlockAudio };
}
