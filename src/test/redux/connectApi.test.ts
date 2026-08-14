import { describe, it, expect, beforeEach } from "vitest";
import { connectApi } from "@/services/api/connectApi";
import { store } from "@/app/store";
import {
  setActiveTab,
  setActiveConversationId,
  setActiveChannelId,
  setActiveMeetingId,
  setActiveThreadMessage,
  setIsNewChatOpen,
  setIsNewChannelOpen,
  setIsNewMeetingOpen,
  setIsSearchOpen,
  openMailArtifact,
  closeMailArtifact,
} from "@/features/connect/connectSlice";
import {
  startOutgoingCall,
  receiveIncomingCall,
  acceptIncomingCall,
  rejectIncomingCall,
  setCallConnected,
  endCall,
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  toggleSpeaker,
  setIceServers,
} from "@/features/connect/callSlice";
import {
  setPrejoinMeeting,
  joinMeetingSuccess,
  leaveMeeting,
  addParticipant,
  removeParticipant,
  toggleMeetingMute,
  toggleMeetingCamera,
  toggleMeetingScreenShare,
  setActiveDrawer,
} from "@/features/connect/meetingSlice";
import {
  setCurrentUserPresence,
  setCustomStatusText,
  setUserPresence,
} from "@/features/connect/presenceSlice";
import {
  setConnected,
  setReconnecting,
  setConnectionError,
  setTypingStart,
  setTypingStop,
} from "@/features/connect/websocketSlice";
import {
  setMasterEnabled,
  setMasterVolume,
  setMutedAll,
  toggleMuteAll,
  resetToDefaults,
} from "@/features/connect/soundSettingsSlice";
import {
  selectActiveTab,
  selectActiveConversationId,
  selectActiveChannelId,
  selectActiveMeetingId,
  selectActiveCall,
  selectIncomingCall,
  selectCallStatus,
  selectIsMeetingJoined,
  selectMeetingParticipants,
  selectCurrentUserPresence,
  selectIsWebSocketConnected,
  selectMasterVolume,
  selectIsMutedAll,
} from "@/features/connect/selectors";
import { ConnectUser, ConnectMeeting } from "@/types/connect";
import { connectWebSocketService } from "@/services/connectWebSocketService";
import { connectWebRTCService } from "@/services/connectWebRTCService";

describe("Connect Module RTK Query Endpoints Coverage (52/52 API Specification)", () => {
  it("should have all Connect endpoints defined on connectApi", () => {
    // 1. Colleagues & Directory
    expect(connectApi.endpoints).toHaveProperty("getColleagues");

    // 2. Global Search
    expect(connectApi.endpoints).toHaveProperty("globalSearch");

    // 3. Direct Conversations & Messaging
    expect(connectApi.endpoints).toHaveProperty("getConversations");
    expect(connectApi.endpoints).toHaveProperty("createConversation");
    expect(connectApi.endpoints).toHaveProperty("getConversationMessages");
    expect(connectApi.endpoints).toHaveProperty("sendMessage");
    expect(connectApi.endpoints).toHaveProperty("markConversationRead");
    expect(connectApi.endpoints).toHaveProperty("pinConversation");
    expect(connectApi.endpoints).toHaveProperty("muteConversation");

    // 4. Message Actions
    expect(connectApi.endpoints).toHaveProperty("toggleReaction");
    expect(connectApi.endpoints).toHaveProperty("pinMessage");
    expect(connectApi.endpoints).toHaveProperty("editMessage");
    expect(connectApi.endpoints).toHaveProperty("deleteMessage");
    expect(connectApi.endpoints).toHaveProperty("getMessageThread");
    expect(connectApi.endpoints).toHaveProperty("postThreadReply");

    // 5. Team Channels
    expect(connectApi.endpoints).toHaveProperty("getChannels");
    expect(connectApi.endpoints).toHaveProperty("createChannel");
    expect(connectApi.endpoints).toHaveProperty("getChannel");
    expect(connectApi.endpoints).toHaveProperty("updateChannel");
    expect(connectApi.endpoints).toHaveProperty("getChannelMessages");
    expect(connectApi.endpoints).toHaveProperty("sendChannelMessage");
    expect(connectApi.endpoints).toHaveProperty("addChannelMembers");
    expect(connectApi.endpoints).toHaveProperty("removeChannelMember");
    expect(connectApi.endpoints).toHaveProperty("leaveChannel");
    expect(connectApi.endpoints).toHaveProperty("archiveChannel");

    // 6. Calls & Voice/Video
    expect(connectApi.endpoints).toHaveProperty("getCallHistory");
    expect(connectApi.endpoints).toHaveProperty("initiateCall");
    expect(connectApi.endpoints).toHaveProperty("updateCallStatus");
    expect(connectApi.endpoints).toHaveProperty("sendCallSignal");
    expect(connectApi.endpoints).toHaveProperty("getIceServers");

    // 7. Meetings & Video Conferencing
    expect(connectApi.endpoints).toHaveProperty("getMeetings");
    expect(connectApi.endpoints).toHaveProperty("createMeeting");
    expect(connectApi.endpoints).toHaveProperty("getMeeting");
    expect(connectApi.endpoints).toHaveProperty("joinMeeting");
    expect(connectApi.endpoints).toHaveProperty("leaveMeeting");
    expect(connectApi.endpoints).toHaveProperty("getMeetingMessages");
    expect(connectApi.endpoints).toHaveProperty("sendMeetingMessage");
    expect(connectApi.endpoints).toHaveProperty("getMeetingParticipants");

    // 8. Shared Files Hub
    expect(connectApi.endpoints).toHaveProperty("getFiles");
    expect(connectApi.endpoints).toHaveProperty("uploadFile");
    expect(connectApi.endpoints).toHaveProperty("getFile");
    expect(connectApi.endpoints).toHaveProperty("deleteFile");

    // 9. Presence & Status
    expect(connectApi.endpoints).toHaveProperty("updatePresence");
    expect(connectApi.endpoints).toHaveProperty("getBatchPresence");

    // 10. Notifications
    expect(connectApi.endpoints).toHaveProperty("getNotifications");
    expect(connectApi.endpoints).toHaveProperty("markNotificationRead");
    expect(connectApi.endpoints).toHaveProperty("clearNotifications");

    // 11. Sound Settings & Preferences
    expect(connectApi.endpoints).toHaveProperty("getSoundSettings");
    expect(connectApi.endpoints).toHaveProperty("updateSoundSettings");

    // 12. AI Copilot & Mail Artifact
    expect(connectApi.endpoints).toHaveProperty("aiTransform");
    expect(connectApi.endpoints).toHaveProperty("dispatchMail");
  });
});

describe("Connect Redux Slices & State Management", () => {
  const dummyUser: ConnectUser = {
    id: "usr_test_123",
    name: "Jane Doe",
    email: "jane.doe@ofc360.com",
    role: "Product Lead",
    department: "Engineering",
  };

  const dummyMeeting: ConnectMeeting = {
    id: "meet_abc",
    title: "Sprint Planning",
    hostId: "usr_host",
    hostName: "Host User",
    startTime: new Date().toISOString(),
    participants: [dummyUser],
    isPrivate: false,
    allowScreenShare: true,
    allowMicrophone: true,
    allowCamera: true,
    status: "in_meeting",
  };

  it("should handle connectSlice UI actions", () => {
    store.dispatch(setActiveTab("channels"));
    expect(selectActiveTab(store.getState())).toBe("channels");

    store.dispatch(setActiveConversationId("conv_999"));
    expect(selectActiveConversationId(store.getState())).toBe("conv_999");

    store.dispatch(setActiveChannelId("chn_888"));
    expect(selectActiveChannelId(store.getState())).toBe("chn_888");

    store.dispatch(setActiveMeetingId("meet_777"));
    expect(selectActiveMeetingId(store.getState())).toBe("meet_777");

    store.dispatch(setIsNewChatOpen(true));
    expect(store.getState().connect.isNewChatOpen).toBe(true);

    store.dispatch(openMailArtifact({ to: "test@ofc360.com", subject: "Review" }));
    expect(store.getState().connect.isMailArtifactOpen).toBe(true);
    expect(store.getState().connect.mailArtifact?.to).toBe("test@ofc360.com");

    store.dispatch(closeMailArtifact());
    expect(store.getState().connect.isMailArtifactOpen).toBe(false);
  });

  it("should handle callSlice calling lifecycle and controls", () => {
    store.dispatch(startOutgoingCall({ targetUser: dummyUser, type: "audio" }));
    expect(selectCallStatus(store.getState())).toBe("calling");
    expect(selectActiveCall(store.getState())?.targetUser.id).toBe(dummyUser.id);

    store.dispatch(setCallConnected());
    expect(selectCallStatus(store.getState())).toBe("connected");

    store.dispatch(toggleMute(true));
    expect(store.getState().connectCall.isMuted).toBe(true);

    store.dispatch(toggleCamera(false));
    expect(store.getState().connectCall.isCameraEnabled).toBe(false);

    store.dispatch(toggleScreenShare(true));
    expect(store.getState().connectCall.isScreenSharing).toBe(true);

    store.dispatch(endCall());
    expect(selectCallStatus(store.getState())).toBe("ended");
    expect(selectActiveCall(store.getState())).toBeNull();

    // Incoming call handling
    store.dispatch(receiveIncomingCall({ caller: dummyUser, type: "video" }));
    expect(selectIncomingCall(store.getState())?.targetUser.name).toBe("Jane Doe");
    expect(selectCallStatus(store.getState())).toBe("ringing");

    store.dispatch(acceptIncomingCall());
    expect(selectCallStatus(store.getState())).toBe("connected");
    expect(selectActiveCall(store.getState())).not.toBeNull();

    store.dispatch(endCall());
    expect(selectActiveCall(store.getState())).toBeNull();
  });

  it("should handle meetingSlice lifecycle", () => {
    store.dispatch(setPrejoinMeeting(dummyMeeting));
    expect(store.getState().connectMeeting.activeMeetingId).toBe("meet_abc");
    expect(selectIsMeetingJoined(store.getState())).toBe(false);

    store.dispatch(joinMeetingSuccess({ meeting: dummyMeeting, user: dummyUser }));
    expect(selectIsMeetingJoined(store.getState())).toBe(true);
    expect(selectMeetingParticipants(store.getState())).toHaveLength(1);

    const participant2: ConnectUser = { id: "usr_part_2", name: "Alex Smith", email: "alex@ofc360.com" };
    store.dispatch(addParticipant(participant2));
    expect(selectMeetingParticipants(store.getState())).toHaveLength(2);

    store.dispatch(removeParticipant("usr_part_2"));
    expect(selectMeetingParticipants(store.getState())).toHaveLength(1);

    store.dispatch(setActiveDrawer("chat"));
    expect(store.getState().connectMeeting.activeDrawer).toBe("chat");

    store.dispatch(leaveMeeting());
    expect(selectIsMeetingJoined(store.getState())).toBe(false);
  });

  it("should handle presenceSlice state updates", () => {
    store.dispatch(setCurrentUserPresence("busy"));
    expect(selectCurrentUserPresence(store.getState())).toBe("busy");

    store.dispatch(setCustomStatusText("In Client Review"));
    expect(store.getState().connectPresence.customStatusText).toBe("In Client Review");

    store.dispatch(setUserPresence({ userId: "usr_100", status: "dnd" }));
    expect(store.getState().connectPresence.userPresenceMap["usr_100"]).toBe("dnd");
  });

  it("should handle websocketSlice connection & typing updates", () => {
    store.dispatch(setConnected(true));
    expect(selectIsWebSocketConnected(store.getState())).toBe(true);

    store.dispatch(setTypingStart({ targetId: "conv_123", user: "Jane Doe" }));
    expect(store.getState().connectWebSocket.typingUsers["conv_123"]).toContain("Jane Doe");

    store.dispatch(setTypingStop({ targetId: "conv_123", user: "Jane Doe" }));
    expect(store.getState().connectWebSocket.typingUsers["conv_123"]).not.toContain("Jane Doe");
  });

  it("should handle soundSettingsSlice controls and defaults", () => {
    store.dispatch(setMasterVolume(85));
    expect(selectMasterVolume(store.getState())).toBe(85);

    store.dispatch(setMutedAll(true));
    expect(selectIsMutedAll(store.getState())).toBe(true);

    store.dispatch(toggleMuteAll());
    expect(selectIsMutedAll(store.getState())).toBe(false);

    store.dispatch(resetToDefaults());
    expect(selectMasterVolume(store.getState())).toBe(70);
  });
});

describe("WebSocket & WebRTC Services", () => {
  it("should provide valid singleton instances and methods", () => {
    expect(connectWebSocketService).toBeDefined();
    expect(typeof connectWebSocketService.connect).toBe("function");
    expect(typeof connectWebSocketService.disconnect).toBe("function");
    expect(typeof connectWebSocketService.send).toBe("function");
    expect(typeof connectWebSocketService.sendTyping).toBe("function");
    expect(typeof connectWebSocketService.onSignal).toBe("function");

    expect(connectWebRTCService).toBeDefined();
    expect(typeof connectWebRTCService.init).toBe("function");
    expect(typeof connectWebRTCService.getLocalMedia).toBe("function");
    expect(typeof connectWebRTCService.startScreenShare).toBe("function");
    expect(typeof connectWebRTCService.stopScreenShare).toBe("function");
    expect(typeof connectWebRTCService.cleanup).toBe("function");
  });
});
