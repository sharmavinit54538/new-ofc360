import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PresenceStatus } from "@/types/connect";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_connect_presence_v1";

export interface PresenceState {
  currentUserPresence: PresenceStatus;
  customStatusText: string;
  userPresenceMap: Record<string, PresenceStatus>;
}

const initialState: PresenceState = {
  currentUserPresence: getStoredData<PresenceStatus>(STORAGE_KEY, "online"),
  customStatusText: "",
  userPresenceMap: {},
};

export const presenceSlice = createSlice({
  name: "connectPresence",
  initialState,
  reducers: {
    setCurrentUserPresence: (state, action: PayloadAction<PresenceStatus>) => {
      state.currentUserPresence = action.payload;
      setStoredData(STORAGE_KEY, action.payload);
    },

    setCustomStatusText: (state, action: PayloadAction<string>) => {
      state.customStatusText = action.payload;
    },

    setUserPresence: (state, action: PayloadAction<{ userId: string; status: PresenceStatus }>) => {
      state.userPresenceMap[action.payload.userId] = action.payload.status;
    },

    setBatchUserPresences: (state, action: PayloadAction<Record<string, PresenceStatus>>) => {
      state.userPresenceMap = {
        ...state.userPresenceMap,
        ...action.payload,
      };
    },
  },
});

export const {
  setCurrentUserPresence,
  setCustomStatusText,
  setUserPresence,
  setBatchUserPresences,
} = presenceSlice.actions;

export default presenceSlice.reducer;
