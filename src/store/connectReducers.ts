import connectReducer from "@/features/connect/connectSlice";
import connectCallReducer from "@/features/connect/callSlice";
import connectMeetingReducer from "@/features/connect/meetingSlice";
import connectPresenceReducer from "@/features/connect/presenceSlice";
import connectWebSocketReducer from "@/features/connect/websocketSlice";
import connectSoundReducer from "@/features/connect/soundSettingsSlice";

export const connectReducers = {
  connect: connectReducer,
  connectCall: connectCallReducer,
  connectMeeting: connectMeetingReducer,
  connectPresence: connectPresenceReducer,
  connectWebSocket: connectWebSocketReducer,
  connectSound: connectSoundReducer,
};
