import { DEFAULT_SETTINGS } from "./soundDefaults";
import { persistSettings } from "./soundActions";
import { createSoundNotificationMethods } from "./soundStoreNotificationMethods";

export const createSoundStoreMethods = (set: any, get: any) => ({
  setMasterEnabled: (isMasterEnabled: boolean) => { set({ isMasterEnabled }); persistSettings(get()); },
  setMasterVolume: (masterVolume: number) => { set({ masterVolume }); persistSettings(get()); },
  setMutedAll: (isMutedAll: boolean) => { set({ isMutedAll }); persistSettings(get()); },
  toggleMuteAll: () => { set((s: any) => ({ isMutedAll: !s.isMutedAll })); persistSettings(get()); },
  setAudioUnlocked: (isAudioUnlocked: boolean) => set({ isAudioUnlocked }),
  setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),
  setIncomingCallsEnabled: (e: boolean) => { set({ isIncomingCallsEnabled: e }); persistSettings(get()); },
  setOutgoingCallsEnabled: (e: boolean) => { set({ isOutgoingCallsEnabled: e }); persistSettings(get()); },
  ...createSoundNotificationMethods(set, get),
  resetToDefaults: () => { set({ ...DEFAULT_SETTINGS }); persistSettings(DEFAULT_SETTINGS); },
});
