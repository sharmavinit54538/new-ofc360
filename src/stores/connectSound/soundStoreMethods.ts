import type { ConnectSoundSettings } from "./soundTypes";
import { DEFAULT_SETTINGS } from "./soundDefaults";
import { persistSettings } from "./soundActions";

export const createSoundStoreMethods = (set: any, get: any) => ({
  setMasterEnabled: (isMasterEnabled: boolean) => { set({ isMasterEnabled }); persistSettings(get()); },
  setMasterVolume: (masterVolume: number) => { set({ masterVolume }); persistSettings(get()); },
  setMutedAll: (isMutedAll: boolean) => { set({ isMutedAll }); persistSettings(get()); },
  toggleMuteAll: () => { set((s: any) => ({ isMutedAll: !s.isMutedAll })); persistSettings(get()); },
  setAudioUnlocked: (isAudioUnlocked: boolean) => set({ isAudioUnlocked }),
  setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),
  setIncomingCallsEnabled: (isIncomingCallsEnabled: boolean) => { set({ isIncomingCallsEnabled }); persistSettings(get()); },
  setOutgoingCallsEnabled: (isOutgoingCallsEnabled: boolean) => { set({ isOutgoingCallsEnabled }); persistSettings(get()); },
  setMessagesEnabled: (isMessagesEnabled: boolean) => { set({ isMessagesEnabled }); persistSettings(get()); },
  setMentionsEnabled: (isMentionsEnabled: boolean) => { set({ isMentionsEnabled }); persistSettings(get()); },
  setGroupMessagesEnabled: (isGroupMessagesEnabled: boolean) => { set({ isGroupMessagesEnabled }); persistSettings(get()); },
  setChannelMessagesEnabled: (isChannelMessagesEnabled: boolean) => { set({ isChannelMessagesEnabled }); persistSettings(get()); },
  setMeetingSoundsEnabled: (isMeetingSoundsEnabled: boolean) => { set({ isMeetingSoundsEnabled }); persistSettings(get()); },
  setParticipantJoinLeaveEnabled: (isParticipantJoinLeaveEnabled: boolean) => { set({ isParticipantJoinLeaveEnabled }); persistSettings(get()); },
  resetToDefaults: () => { set({ ...DEFAULT_SETTINGS }); persistSettings(DEFAULT_SETTINGS); },
});
