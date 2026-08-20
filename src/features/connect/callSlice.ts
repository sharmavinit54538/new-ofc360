import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveCall, CallStatus, CallType, ConnectUser, IceServerConfig } from "@/types/connect";

export interface CallState {
  activeCall: ActiveCall | null;
  incomingCall: ActiveCall | null;
  status: CallStatus;
  type: CallType | null;
  remoteUser: ConnectUser | null;
  isMuted: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  isSpeakerOn: boolean;
  duration: number;
  iceServers: IceServerConfig[];
}

const initialState: CallState = {
  activeCall: null,
  incomingCall: null,
  status: "idle",
  type: null,
  remoteUser: null,
  isMuted: false,
  isCameraEnabled: true,
  isScreenSharing: false,
  isSpeakerOn: true,
  duration: 0,
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const callSlice = createSlice({
  name: "connectCall",
  initialState,
  reducers: {
    startOutgoingCall: (
      state,
      action: PayloadAction<{ targetUser: ConnectUser; type: CallType; callId?: string }>
    ) => {
      const callId = action.payload.callId || `call_${Date.now()}`;
      const newCall: ActiveCall = {
        id: callId,
        type: action.payload.type,
        targetUser: action.payload.targetUser,
        status: "calling",
        startTime: Date.now(),
        duration: 0,
        isMuted: false,
        isCameraOff: action.payload.type === "audio",
        isScreenSharing: false,
        isSpeakerOn: true,
      };

      state.activeCall = newCall;
      state.status = "calling";
      state.type = action.payload.type;
      state.remoteUser = action.payload.targetUser;
      state.isMuted = false;
      state.isCameraEnabled = action.payload.type === "video";
      state.duration = 0;
    },

    receiveIncomingCall: (
      state,
      action: PayloadAction<{ caller: ConnectUser; type: CallType; callId?: string }>
    ) => {
      const callId = action.payload.callId || `call_inc_${Date.now()}`;
      const incoming: ActiveCall = {
        id: callId,
        type: action.payload.type,
        targetUser: action.payload.caller,
        isIncoming: true,
        status: "ringing",
        duration: 0,
        isMuted: false,
        isCameraOff: action.payload.type === "audio",
        isScreenSharing: false,
      };

      state.incomingCall = incoming;
      state.status = "ringing";
      state.type = action.payload.type;
      state.remoteUser = action.payload.caller;
    },

    acceptIncomingCall: (state) => {
      if (!state.incomingCall) return;
      const connectedCall: ActiveCall = {
        ...state.incomingCall,
        status: "connected",
        startTime: Date.now(),
        duration: 0,
      };
      state.activeCall = connectedCall;
      state.incomingCall = null;
      state.status = "connected";
    },

    rejectIncomingCall: (state) => {
      state.incomingCall = null;
      state.status = "idle";
      state.remoteUser = null;
      state.type = null;
    },

    setCallConnected: (state, action?: PayloadAction<{ callId?: string } | void | undefined>) => {
      if (state.activeCall) {
        state.activeCall.status = "connected";
        state.activeCall.startTime = state.activeCall.startTime || Date.now();
      }
      state.status = "connected";
    },

    endCall: (state) => {
      state.activeCall = null;
      state.incomingCall = null;
      state.status = "ended";
      state.type = null;
      state.remoteUser = null;
      state.duration = 0;
      state.isScreenSharing = false;
    },

    resetCallState: () => initialState,

    setIceServers: (state, action: PayloadAction<IceServerConfig[]>) => {
      state.iceServers = action.payload;
    },

    toggleMute: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload !== undefined ? action.payload : !state.isMuted;
      state.isMuted = next;
      if (state.activeCall) state.activeCall.isMuted = next;
    },

    toggleCamera: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload !== undefined ? action.payload : !state.isCameraEnabled;
      state.isCameraEnabled = next;
      if (state.activeCall) state.activeCall.isCameraOff = !next;
    },

    toggleScreenShare: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload !== undefined ? action.payload : !state.isScreenSharing;
      state.isScreenSharing = next;
      if (state.activeCall) state.activeCall.isScreenSharing = next;
    },

    toggleSpeaker: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload !== undefined ? action.payload : !state.isSpeakerOn;
      state.isSpeakerOn = next;
      if (state.activeCall) state.activeCall.isSpeakerOn = next;
    },

    incrementCallDuration: (state) => {
      if (state.status === "connected") {
        state.duration += 1;
        if (state.activeCall) state.activeCall.duration += 1;
      }
    },

    setCallStatus: (state, action: PayloadAction<CallStatus>) => {
      state.status = action.payload;
      if (state.activeCall) state.activeCall.status = action.payload;
    },
  },
});

export const {
  startOutgoingCall,
  receiveIncomingCall,
  acceptIncomingCall,
  rejectIncomingCall,
  setCallConnected,
  endCall,
  resetCallState,
  setIceServers,
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  toggleSpeaker,
  incrementCallDuration,
  setCallStatus,
} = callSlice.actions;

export default callSlice.reducer;