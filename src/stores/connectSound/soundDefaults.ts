import type { ConnectSoundSettings } from "./soundTypes";

export const DEFAULT_SETTINGS: Omit<ConnectSoundSettings, "isAudioUnlocked" | "isSettingsOpen"> = {
  isMasterEnabled: true, isIncomingCallsEnabled: true, isOutgoingCallsEnabled: true,
  isMessagesEnabled: true, isMentionsEnabled: true, isGroupMessagesEnabled: true,
  isChannelMessagesEnabled: true, isMeetingSoundsEnabled: true, isParticipantJoinLeaveEnabled: true,
  masterVolume: 70, isMutedAll: false,
};