import { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

// Connect UI Selectors
export const selectConnectState = (state: RootState) => state.connect;
export const selectActiveTab = (state: RootState) => state.connect.activeTab;
export const selectActiveConversationId = (state: RootState) => state.connect.activeConversationId;
export const selectActiveChannelId = (state: RootState) => state.connect.activeChannelId;
export const selectActiveMeetingId = (state: RootState) => state.connect.activeMeetingId;
export const selectActiveThreadMessage = (state: RootState) => state.connect.activeThreadMessage;
export const selectSearchQuery = (state: RootState) => state.connect.searchQuery;
export const selectSearchType = (state: RootState) => state.connect.searchType;
export const selectIsNewChatOpen = (state: RootState) => state.connect.isNewChatOpen;
export const selectIsNewChannelOpen = (state: RootState) => state.connect.isNewChannelOpen;
export const selectIsNewMeetingOpen = (state: RootState) => state.connect.isNewMeetingOpen;
export const selectIsSearchOpen = (state: RootState) => state.connect.isSearchOpen;
export const selectMailArtifact = (state: RootState) => state.connect.mailArtifact;
export const selectIsMailArtifactOpen = (state: RootState) => state.connect.isMailArtifactOpen;

// Call Selectors
export const selectCallState = (state: RootState) => state.connectCall;
export const selectActiveCall = (state: RootState) => state.connectCall.activeCall;
export const selectIncomingCall = (state: RootState) => state.connectCall.incomingCall;
export const selectCallStatus = (state: RootState) => state.connectCall.status;
export const selectCallType = (state: RootState) => state.connectCall.type;
export const selectCallRemoteUser = (state: RootState) => state.connectCall.remoteUser;
export const selectIsCallMuted = (state: RootState) => state.connectCall.isMuted;
export const selectIsCallCameraEnabled = (state: RootState) => state.connectCall.isCameraEnabled;
export const selectIsCallScreenSharing = (state: RootState) => state.connectCall.isScreenSharing;
export const selectIsCallSpeakerOn = (state: RootState) => state.connectCall.isSpeakerOn;
export const selectCallDuration = (state: RootState) => state.connectCall.duration;
export const selectIceServers = (state: RootState) => state.connectCall.iceServers;

// Meeting Selectors
export const selectMeetingState = (state: RootState) => state.connectMeeting;
export const selectCurrentMeeting = (state: RootState) => state.connectMeeting.currentMeeting;
export const selectIsMeetingJoined = (state: RootState) => state.connectMeeting.joined;
export const selectMeetingParticipants = (state: RootState) => state.connectMeeting.participants;
export const selectIsMeetingScreenSharing = (state: RootState) => state.connectMeeting.isScreenSharing;
export const selectIsMeetingMuted = (state: RootState) => state.connectMeeting.isMuted;
export const selectIsMeetingCameraEnabled = (state: RootState) => state.connectMeeting.isCameraEnabled;
export const selectMeetingActiveDrawer = (state: RootState) => state.connectMeeting.activeDrawer;
export const selectMeetingDuration = (state: RootState) => state.connectMeeting.duration;

// Presence Selectors
export const selectPresenceState = (state: RootState) => state.connectPresence;
export const selectCurrentUserPresence = (state: RootState) => state.connectPresence.currentUserPresence;
export const selectCustomStatusText = (state: RootState) => state.connectPresence.customStatusText;
export const selectUserPresenceMap = (state: RootState) => state.connectPresence.userPresenceMap;

export const selectUserPresence = createSelector(
  [selectUserPresenceMap, (_state: RootState, userId: string) => userId],
  (presenceMap, userId) => presenceMap[userId] || "offline"
);

// WebSocket Selectors
export const selectWebSocketState = (state: RootState) => state.connectWebSocket;
export const selectIsWebSocketConnected = (state: RootState) => state.connectWebSocket.connected;
export const selectIsWebSocketReconnecting = (state: RootState) => state.connectWebSocket.reconnecting;
export const selectWebSocketError = (state: RootState) => state.connectWebSocket.connectionError;
export const selectOnlineUsers = (state: RootState) => state.connectWebSocket.onlineUsers;
export const selectTypingUsers = (state: RootState) => state.connectWebSocket.typingUsers;

export const selectTargetTypingUsers = createSelector(
  [selectTypingUsers, (_state: RootState, targetId: string) => targetId],
  (typingUsersMap, targetId) => typingUsersMap[targetId] || []
);

// Sound Settings Selectors
export const selectSoundSettingsState = (state: RootState) => state.connectSound;
export const selectMasterVolume = (state: RootState) => state.connectSound.masterVolume;
export const selectIsMutedAll = (state: RootState) => state.connectSound.isMutedAll;
export const selectIsAudioUnlocked = (state: RootState) => state.connectSound.isAudioUnlocked;
export const selectIsSoundSettingsOpen = (state: RootState) => state.connectSound.isSettingsOpen;
