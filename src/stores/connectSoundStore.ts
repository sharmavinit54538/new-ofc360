import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_connect_sound_settings_v1";

export interface ConnectSoundSettings {
  isMasterEnabled: boolean;
  isIncomingCallsEnabled: boolean;
  isOutgoingCallsEnabled: boolean;
  isMessagesEnabled: boolean;
  isMentionsEnabled: boolean;
  isGroupMessagesEnabled: boolean;
  isChannelMessagesEnabled: boolean;
  isMeetingSoundsEnabled: boolean;
  isParticipantJoinLeaveEnabled: boolean;
  masterVolume: number; // 0 to 100
  isMutedAll: boolean;
  isAudioUnlocked: boolean;
  isSettingsOpen: boolean;
}

interface ConnectSoundState extends ConnectSoundSettings {
  // Actions
  setMasterEnabled: (enabled: boolean) => void;
  setIncomingCallsEnabled: (enabled: boolean) => void;
  setOutgoingCallsEnabled: (enabled: boolean) => void;
  setMessagesEnabled: (enabled: boolean) => void;
  setMentionsEnabled: (enabled: boolean) => void;
  setGroupMessagesEnabled: (enabled: boolean) => void;
  setChannelMessagesEnabled: (enabled: boolean) => void;
  setMeetingSoundsEnabled: (enabled: boolean) => void;
  setParticipantJoinLeaveEnabled: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
  setMutedAll: (muted: boolean) => void;
  toggleMuteAll: () => void;
  setAudioUnlocked: (unlocked: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: Omit<ConnectSoundSettings, "isAudioUnlocked" | "isSettingsOpen"> = {
  isMasterEnabled: true,
  isIncomingCallsEnabled: true,
  isOutgoingCallsEnabled: true,
  isMessagesEnabled: true,
  isMentionsEnabled: true,
  isGroupMessagesEnabled: true,
  isChannelMessagesEnabled: true,
  isMeetingSoundsEnabled: true,
  isParticipantJoinLeaveEnabled: true,
  masterVolume: 70,
  isMutedAll: false,
};

const initialPersisted = getStoredData<typeof DEFAULT_SETTINGS>(STORAGE_KEY, DEFAULT_SETTINGS);

export const useConnectSoundStore = create<ConnectSoundState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  ...initialPersisted,
  isAudioUnlocked: false,
  isSettingsOpen: false,

  setMasterEnabled: (isMasterEnabled) => {
    set({ isMasterEnabled });
    persistSettings(get());
  },
  setIncomingCallsEnabled: (isIncomingCallsEnabled) => {
    set({ isIncomingCallsEnabled });
    persistSettings(get());
  },
  setOutgoingCallsEnabled: (isOutgoingCallsEnabled) => {
    set({ isOutgoingCallsEnabled });
    persistSettings(get());
  },
  setMessagesEnabled: (isMessagesEnabled) => {
    set({ isMessagesEnabled });
    persistSettings(get());
  },
  setMentionsEnabled: (isMentionsEnabled) => {
    set({ isMentionsEnabled });
    persistSettings(get());
  },
  setGroupMessagesEnabled: (isGroupMessagesEnabled) => {
    set({ isGroupMessagesEnabled });
    persistSettings(get());
  },
  setChannelMessagesEnabled: (isChannelMessagesEnabled) => {
    set({ isChannelMessagesEnabled });
    persistSettings(get());
  },
  setMeetingSoundsEnabled: (isMeetingSoundsEnabled) => {
    set({ isMeetingSoundsEnabled });
    persistSettings(get());
  },
  setParticipantJoinLeaveEnabled: (isParticipantJoinLeaveEnabled) => {
    set({ isParticipantJoinLeaveEnabled });
    persistSettings(get());
  },
  setMasterVolume: (masterVolume) => {
    const clamped = Math.max(0, Math.min(100, masterVolume));
    set({ masterVolume: clamped });
    persistSettings(get());
  },
  setMutedAll: (isMutedAll) => {
    set({ isMutedAll });
    persistSettings(get());
  },
  toggleMuteAll: () => {
    const nextMuted = !get().isMutedAll;
    set({ isMutedAll: nextMuted });
    persistSettings(get());
  },
  setAudioUnlocked: (isAudioUnlocked) => set({ isAudioUnlocked }),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  resetToDefaults: () => {
    set({ ...DEFAULT_SETTINGS });
    persistSettings(get());
  },
}));

function persistSettings(state: ConnectSoundState) {
  setStoredData(STORAGE_KEY, {
    isMasterEnabled: state.isMasterEnabled,
    isIncomingCallsEnabled: state.isIncomingCallsEnabled,
    isOutgoingCallsEnabled: state.isOutgoingCallsEnabled,
    isMessagesEnabled: state.isMessagesEnabled,
    isMentionsEnabled: state.isMentionsEnabled,
    isGroupMessagesEnabled: state.isGroupMessagesEnabled,
    isChannelMessagesEnabled: state.isChannelMessagesEnabled,
    isMeetingSoundsEnabled: state.isMeetingSoundsEnabled,
    isParticipantJoinLeaveEnabled: state.isParticipantJoinLeaveEnabled,
    masterVolume: state.masterVolume,
    isMutedAll: state.isMutedAll,
  });
}