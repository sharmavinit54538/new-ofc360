import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectMeeting, ConnectUser } from "@/types/connect";

export interface MeetingState {
  activeMeetingId: string | null;
  joined: boolean;
  currentMeeting: ConnectMeeting | null;
  participants: ConnectUser[];
  isScreenSharing: boolean;
  isMuted: boolean;
  isCameraEnabled: boolean;
  activeDrawer: "chat" | "participants" | "files" | "info" | null;
  duration: number;
}

const initialState: MeetingState = {
  activeMeetingId: null,
  joined: false,
  currentMeeting: null,
  participants: [],
  isScreenSharing: false,
  isMuted: false,
  isCameraEnabled: true,
  activeDrawer: null,
  duration: 0,
};

export const meetingSlice = createSlice({
  name: "connectMeeting",
  initialState,
  reducers: {
    setPrejoinMeeting: (state, action: PayloadAction<ConnectMeeting>) => {
      state.activeMeetingId = action.payload.id;
      state.currentMeeting = action.payload;
      state.participants = action.payload.participants || [];
      state.joined = false;
      state.duration = 0;
    },

    joinMeetingSuccess: (state, action: PayloadAction<{ meeting: ConnectMeeting; user: ConnectUser }>) => {
      state.activeMeetingId = action.payload.meeting.id;
      state.currentMeeting = action.payload.meeting;
      state.joined = true;

      // Add user if not already in participants
      const exists = state.participants.some((p) => p.id === action.payload.user.id);
      if (!exists) {
        state.participants.push(action.payload.user);
      }
    },

    leaveMeeting: (state) => {
      state.joined = false;
      state.currentMeeting = null;
      state.activeMeetingId = null;
      state.participants = [];
      state.isScreenSharing = false;
      state.activeDrawer = null;
      state.duration = 0;
    },

    addParticipant: (state, action: PayloadAction<ConnectUser>) => {
      const exists = state.participants.some((p) => p.id === action.payload.id);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },

    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter((p) => p.id !== action.payload);
    },

    setParticipants: (state, action: PayloadAction<ConnectUser[]>) => {
      state.participants = action.payload;
    },

    toggleMeetingMute: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMuted = action.payload !== undefined ? action.payload : !state.isMuted;
    },

    toggleMeetingCamera: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCameraEnabled = action.payload !== undefined ? action.payload : !state.isCameraEnabled;
    },

    toggleMeetingScreenShare: (state, action: PayloadAction<boolean | undefined>) => {
      state.isScreenSharing = action.payload !== undefined ? action.payload : !state.isScreenSharing;
    },

    setActiveDrawer: (state, action: PayloadAction<MeetingState["activeDrawer"]>) => {
      state.activeDrawer = action.payload;
    },

    incrementMeetingDuration: (state) => {
      if (state.joined) {
        state.duration += 1;
      }
    },
  },
});

export const {
  setPrejoinMeeting,
  joinMeetingSuccess,
  leaveMeeting,
  addParticipant,
  removeParticipant,
  setParticipants,
  toggleMeetingMute,
  toggleMeetingCamera,
  toggleMeetingScreenShare,
  setActiveDrawer,
  incrementMeetingDuration,
} = meetingSlice.actions;

export default meetingSlice.reducer;
