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
  currentUserPresence: getStoredData<PresenceStatus>(STORAGE_KEY, "offline"),
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
        id?: string;
        email?: string;
        status: PresenceStatus;
      }>
    ) => {
      const { userId, user_id, employeeId, employee_id, id, email, status } = action.payload;
      const keys = [userId, user_id, employeeId, employee_id, id]
        .filter(Boolean)
        .map((k) => String(k).trim());

      keys.forEach((key) => {
        if (key) {
          state.userPresenceMap[key] = status;
          const cleanKey = key.replace(/^conv_/, "").replace(/^usr_/, "");
          if (cleanKey && cleanKey !== key) {
            state.userPresenceMap[cleanKey] = status;
          }
        }
      });

      if (email) {
        state.userPresenceMap[String(email).trim().toLowerCase()] = status;
      }
    },

    setBatchUserPresences: (state, action: PayloadAction<Record<string, PresenceStatus>>) => {
      const batch = action.payload || {};
      const newEntries: Record<string, PresenceStatus> = {};
      Object.entries(batch).forEach(([key, status]) => {
        if (key) {
          const trimmed = String(key).trim();
          newEntries[trimmed] = status;
          const cleanKey = trimmed.replace(/^conv_/, "").replace(/^usr_/, "");
          if (cleanKey && cleanKey !== trimmed) {
            newEntries[cleanKey] = status;
          }
        }
      });
      state.userPresenceMap = {
        ...state.userPresenceMap,
        ...newEntries,
      };
    },

    resetPresenceState: (state) => {
      state.userPresenceMap = {};
      state.currentUserPresence = "offline";
      state.customStatusText = "";
      setStoredData(STORAGE_KEY, "offline");
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
  state.connectPresence?.currentUserPresence || "offline";

export const selectUserPresence = (
  state: RootState,
  userOrId?: string | { id?: string; _id?: string; userId?: string; user_id?: string; employeeId?: string; employee_id?: string; email?: string; presence?: PresenceStatus } | null
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

  // Object entity - check all possible alias identifiers
  const id = userOrId.id ? String(userOrId.id).trim() : "";
  if (id) {
    if (map[id]) return map[id];
    const cleanId = id.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanId]) return map[cleanId];
  }

  const rawId = (userOrId as any)._id ? String((userOrId as any)._id).trim() : "";
  if (rawId) {
    if (map[rawId]) return map[rawId];
    const cleanRawId = rawId.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanRawId]) return map[cleanRawId];
  }

  const userId = userOrId.userId ? String(userOrId.userId).trim() : "";
  if (userId) {
    if (map[userId]) return map[userId];
    const cleanUserId = userId.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanUserId]) return map[cleanUserId];
  }

  const userIdUnderscore = userOrId.user_id ? String(userOrId.user_id).trim() : "";
  if (userIdUnderscore) {
    if (map[userIdUnderscore]) return map[userIdUnderscore];
    const cleanUserIdUnderscore = userIdUnderscore.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanUserIdUnderscore]) return map[cleanUserIdUnderscore];
  }

  const empId = userOrId.employee_id || userOrId.employeeId ? String(userOrId.employee_id || userOrId.employeeId).trim() : "";
  if (empId) {
    if (map[empId]) return map[empId];
    const cleanEmpId = empId.replace(/^conv_/, "").replace(/^usr_/, "");
    if (map[cleanEmpId]) return map[cleanEmpId];
  }

  const email = userOrId.email ? String(userOrId.email).trim().toLowerCase() : "";
  if (email && map[email]) return map[email];

  // Return static presence if explicitly provided (and valid), otherwise offline
  if (userOrId.presence && ["online", "away", "busy", "dnd", "offline"].includes(userOrId.presence)) {
    return userOrId.presence;
  }

  return "offline";
};

export default presenceSlice.reducer;