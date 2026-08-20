export interface ConnectSoundSettings {
  isMasterEnabled: boolean; isIncomingCallsEnabled: boolean; isOutgoingCallsEnabled: boolean;
  isMessagesEnabled: boolean; isMentionsEnabled: boolean; isGroupMessagesEnabled: boolean;
  isChannelMessagesEnabled: boolean; isMeetingSoundsEnabled: boolean; isParticipantJoinLeaveEnabled: boolean;
  masterVolume: number; isMutedAll: boolean; isAudioUnlocked: boolean; isSettingsOpen: boolean;
}