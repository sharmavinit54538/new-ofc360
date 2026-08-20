import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectSoundSettings } from "@/types/connect";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_connect_sound_settings_v1";

const DEFAULT_SETTINGS: ConnectSoundSettings = {
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
  isAudioUnlocked: false,
  isSettingsOpen: false,
};

const initialPersisted = getStoredData<Partial<ConnectSoundSettings>>(STORAGE_KEY, {});

const initialState: ConnectSoundSettings = {
  ...DEFAULT_SETTINGS,
  ...initialPersisted,
  isAudioUnlocked: false,
  isSettingsOpen: false,
};

export const soundSettingsSlice = createSlice({
  name: "connectSound",
  initialState,
  reducers: {
    setMasterEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMasterEnabled = action.payload;
      persist(state);
    },
    setIncomingCallsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isIncomingCallsEnabled = action.payload;
      persist(state);
    },
    setOutgoingCallsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isOutgoingCallsEnabled = action.payload;
      persist(state);
    },
    setMessagesEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMessagesEnabled = action.payload;
      persist(state);
    },
    setMentionsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMentionsEnabled = action.payload;
      persist(state);
    },
    setGroupMessagesEnabled: (state, action: PayloadAction<boolean>) => {
      state.isGroupMessagesEnabled = action.payload;
      persist(state);
    },
    setChannelMessagesEnabled: (state, action: PayloadAction<boolean>) => {
      state.isChannelMessagesEnabled = action.payload;
      persist(state);
    },
    setMeetingSoundsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMeetingSoundsEnabled = action.payload;
      persist(state);
    },
    setParticipantJoinLeaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.isParticipantJoinLeaveEnabled = action.payload;
      persist(state);
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = Math.max(0, Math.min(100, action.payload));
      persist(state);
    },
    setMutedAll: (state, action: PayloadAction<boolean>) => {
      state.isMutedAll = action.payload;
      persist(state);
    },
    toggleMuteAll: (state) => {
      state.isMutedAll = !state.isMutedAll;
      persist(state);
    },
    setAudioUnlocked: (state, action: PayloadAction<boolean>) => {
      state.isAudioUnlocked = action.payload;
    },
    setIsSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    setSoundSettings: (state, action: PayloadAction<Partial<ConnectSoundSettings>>) => {
      Object.assign(state, action.payload);
      persist(state);
    },
    resetToDefaults: (state) => {
      Object.assign(state, DEFAULT_SETTINGS);
      persist(state);
    },
  },
});

function persist(state: ConnectSoundSettings) {
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

export const {
  setMasterEnabled,
  setIncomingCallsEnabled,
  setOutgoingCallsEnabled,
  setMessagesEnabled,
  setMentionsEnabled,
  setGroupMessagesEnabled,
  setChannelMessagesEnabled,
  setMeetingSoundsEnabled,
  setParticipantJoinLeaveEnabled,
  setMasterVolume,
  setMutedAll,
  toggleMuteAll,
  setAudioUnlocked,
  setIsSettingsOpen,
  setSoundSettings,
  resetToDefaults,
} = soundSettingsSlice.actions;

export default soundSettingsSlice.reducer;