import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebSocketEvent } from "@/types/connect";

export interface WebSocketState {
  connected: boolean;
  reconnecting: boolean;
  lastEvent: WebSocketEvent | null;
  connectionError: string | null;
  onlineUsers: string[];
  typingUsers: Record<string, string[]>; // targetId -> array of user names / user IDs
}

const initialState: WebSocketState = {
  connected: false,
  reconnecting: false,
  lastEvent: null,
  connectionError: null,
  onlineUsers: [],
  typingUsers: {},
};

export const websocketSlice = createSlice({
  name: "connectWebSocket",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (action.payload) {
        state.reconnecting = false;
        state.connectionError = null;
      }
    },

    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },

    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
      if (action.payload) {
        state.connected = false;
      }
    },

    setLastEvent: (state, action: PayloadAction<WebSocketEvent>) => {
      state.lastEvent = action.payload;
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },

    setTypingStart: (state, action: PayloadAction<{ targetId: string; user: string }>) => {
      const { targetId, user } = action.payload;
      const current = state.typingUsers[targetId] || [];
      if (!current.includes(user)) {
        state.typingUsers[targetId] = [...current, user];
      }
    },

    setTypingStop: (state, action: PayloadAction<{ targetId: string; user: string }>) => {
      const { targetId, user } = action.payload;
      const current = state.typingUsers[targetId] || [];
      state.typingUsers[targetId] = current.filter((u) => u !== user);
    },
  },
});

export const {
  setConnected,
  setReconnecting,
  setConnectionError,
  setLastEvent,
  setOnlineUsers,
  setTypingStart,
  setTypingStop,
} = websocketSlice.actions;

export default websocketSlice.reducer;