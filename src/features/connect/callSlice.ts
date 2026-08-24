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
  errorMessage?: string;
}

const initialState: CallState = {
  activeCall: null,
  incomingCall: null,
  status: "IDLE",
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
        status: "OUTGOING_CALLING",
        startTime: Date.now(),
        duration: 0,
        isMuted: false,
        isCameraOff: action.payload.type === "audio",
        isScreenSharing: false,
        isSpeakerOn: true,
      };

      state.activeCall = newCall;
      state.status = "OUTGOING_CALLING";
      state.type = action.payload.type;
      state.remoteUser = action.payload.targetUser;
      state.isMuted = false;
      state.isCameraEnabled = action.payload.type === "video";
      state.duration = 0;
      state.errorMessage = undefined;
    },

    setOutgoingRinging: (state) => {
      state.status = "OUTGOING_RINGING";
      if (state.activeCall) {
        state.activeCall.status = "OUTGOING_RINGING";
      }
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
        status: "INCOMING_RINGING",
        duration: 0,
        isMuted: false,
        isCameraOff: action.payload.type === "audio",
        isScreenSharing: false,
      };

      state.incomingCall = incoming;
      state.status = "INCOMING_RINGING";
      state.type = action.payload.type;
      state.remoteUser = action.payload.caller;
      state.errorMessage = undefined;
    },

    acceptIncomingCall: (state) => {
      if (!state.incomingCall) return;
      const connectingCall: ActiveCall = {
        ...state.incomingCall,
        status: "CONNECTING",
        startTime: Date.now(),
        duration: 0,
      };
      state.activeCall = connectingCall;
      state.incomingCall = null;
      state.status = "CONNECTING";
    },

    rejectIncomingCall: (state) => {
      state.incomingCall = null;
      state.status = "DECLINED";
      state.remoteUser = null;
      state.type = null;
    },

    setCallConnecting: (state) => {
      state.status = "CONNECTING";
      if (state.activeCall) {
        state.activeCall.status = "CONNECTING";
      }
    },

    setCallConnected: (state, action?: PayloadAction<{ callId?: string } | void | undefined>) => {
      if (state.activeCall) {
        state.activeCall.status = "CONNECTED";
        state.activeCall.startTime = state.activeCall.startTime || Date.now();
      }
      state.status = "CONNECTED";
    },

    setCallDeclined: (state) => {
      state.status = "DECLINED";
      if (state.activeCall) {
        state.activeCall.status = "DECLINED";
      }
    },

    setCallMissed: (state) => {
      state.status = "MISSED";
      if (state.activeCall) {
        state.activeCall.status = "MISSED";
      }
    },

    setCallFailed: (state, action?: PayloadAction<string | undefined>) => {
      state.status = "FAILED";
      state.errorMessage = action?.payload || "Unable to connect call";
      if (state.activeCall) {
        state.activeCall.status = "FAILED";
      }
    },

    endCall: (state) => {
      state.status = "ENDED";
      if (state.activeCall) {
        state.activeCall.status = "ENDED";
      }
      state.incomingCall = null;
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
      if (state.status === "CONNECTED" || state.status === "connected") {
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
  setOutgoingRinging,
  receiveIncomingCall,
  acceptIncomingCall,
  rejectIncomingCall,
  setCallConnecting,
  setCallConnected,
  setCallDeclined,
  setCallMissed,
  setCallFailed,
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