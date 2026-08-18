import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PresenceStatus } from "@/types/connect";
import { getStoredData, setStoredData } from "@/utils/storage";
import type { RootState } from "@/app/store";

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

    setUserPresence: (
      state,
      action: PayloadAction<{
        userId: string;
        user_id?: string;
        employeeId?: string;
        employee_id?: string;
        email?: string;
        status: PresenceStatus;
      }>
    ) => {
      const { userId, user_id, employeeId, employee_id, email, status } = action.payload;
      if (userId) state.userPresenceMap[String(userId).trim()] = status;
      if (user_id) state.userPresenceMap[String(user_id).trim()] = status;
      if (employeeId) state.userPresenceMap[String(employeeId).trim()] = status;
      if (employee_id) state.userPresenceMap[String(employee_id).trim()] = status;
      if (email) state.userPresenceMap[String(email).trim().toLowerCase()] = status;
    },

    setBatchUserPresences: (state, action: PayloadAction<Record<string, PresenceStatus>>) => {
      state.userPresenceMap = {
        ...state.userPresenceMap,
        ...action.payload,
      };
    },

    resetPresenceState: (state) => {
      state.userPresenceMap = {};
      state.currentUserPresence = "online";
      state.customStatusText = "";
    },
  },
});

export const {
  setCurrentUserPresence,
  setCustomStatusText,
  setUserPresence,
  setBatchUserPresences,
  resetPresenceState,
} = presenceSlice.actions;

// Selectors
export const selectUserPresenceMap = (state: RootState) =>
  state.connectPresence?.userPresenceMap || {};

export const selectCurrentUserPresence = (state: RootState) =>
  state.connectPresence?.currentUserPresence || "online";

export const selectUserPresence = (
  state: RootState,
  userOrId?: string | { id?: string; _id?: string; userId?: string; user_id?: string; employee_id?: string; email?: string; presence?: PresenceStatus } | null
): PresenceStatus => {
  if (!userOrId) return "offline";
  const map = state.connectPresence?.userPresenceMap || {};

  if (typeof userOrId === "string") {
    const key = userOrId.trim();
    if (map[key]) return map[key];
    const cleanKey = key.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanKey]) return map[cleanKey];
    return "offline";
  }

  // Object entity
  const id = userOrId.id ? String(userOrId.id).trim() : "";
  if (id && map[id]) return map[id];

  const rawId = (userOrId as any)._id ? String((userOrId as any)._id).trim() : "";
  if (rawId && map[rawId]) return map[rawId];

  const userId = userOrId.userId ? String(userOrId.userId).trim() : "";
  if (userId && map[userId]) return map[userId];

  const userIdUnderscore = userOrId.user_id ? String(userOrId.user_id).trim() : "";
  if (userIdUnderscore && map[userIdUnderscore]) return map[userIdUnderscore];

  const empId = userOrId.employee_id ? String(userOrId.employee_id).trim() : "";
  if (empId && map[empId]) return map[empId];

  const email = userOrId.email ? String(userOrId.email).trim().toLowerCase() : "";
  if (email && map[email]) return map[email];

  // Return static presence if explicitly provided (and not empty/undefined), otherwise offline
  if (userOrId.presence && ["online", "away", "busy", "dnd", "offline"].includes(userOrId.presence)) {
    return userOrId.presence;
  }

  return "offline";
};

export default presenceSlice.reducer;
