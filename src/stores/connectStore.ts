import { create } from "zustand";
import { connectAudioManager } from "@/services/connectAudioManager";
import {
  ConnectUser,
  ConnectMessage,
  ConnectConversation,
  ConnectChannel,
  ActiveCall,
  ConnectMeeting,
  ConnectSharedFile,
  ConnectNotification,
  MailArtifactDraft,
  PresenceStatus,
} from "@/types/connect";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEYS = {
  CHANNELS: "ofc360_connect_channels_v1",
  CONVERSATIONS: "ofc360_connect_conversations_v1",
  MESSAGES: "ofc360_connect_messages_v1",
  MEETINGS: "ofc360_connect_meetings_v1",
  FILES: "ofc360_connect_files_v1",
  NOTIFICATIONS: "ofc360_connect_notifications_v1",
  USER_PRESENCE: "ofc360_connect_presence_v1",
};

interface ConnectState {
  // Navigation & Active View
  activeTab: "chat" | "channels" | "calls" | "meetings" | "files" | "contacts";
  activeConversationId: string | null;
  activeChannelId: string | null;
  activeMeetingId: string | null;
  activeThreadMessage: ConnectMessage | null;

  // Data Collections (persisted locally per session without fake data)
  conversations: ConnectConversation[];
  channels: ConnectChannel[];
  messages: Record<string, ConnectMessage[]>; // keyed by conversationId or channelId
  meetings: ConnectMeeting[];
  sharedFiles: ConnectSharedFile[];
  notifications: ConnectNotification[];

  // Presence
  currentUserPresence: PresenceStatus;
  userPresenceMap: Record<string, PresenceStatus>;

  // Call & Meeting Runtime State
  activeCall: ActiveCall | null;
  incomingCall: ActiveCall | null;
  currentMeetingRoom: ConnectMeeting | null;
  isMeetingInSession: boolean;

  // Modals & Panels
  isNewChatOpen: boolean;
  isNewChannelOpen: boolean;
  isNewMeetingOpen: boolean;
  isSearchOpen: boolean;
  mailArtifact: MailArtifactDraft | null;
  isMailArtifactOpen: boolean;

  // Actions
  setActiveTab: (tab: ConnectState["activeTab"]) => void;
  setActiveConversationId: (id: string | null) => void;
  setActiveChannelId: (id: string | null) => void;
  setActiveMeetingId: (id: string | null) => void;
  setActiveThreadMessage: (msg: ConnectMessage | null) => void;

  // Conversation & Message Actions
  startDirectConversation: (targetUser: ConnectUser) => string;
  sendMessage: (payload: {
    targetId: string; // conversationId or channelId
    sender: ConnectUser;
    content: string;
    attachments?: ConnectMessage["attachments"];
    replyToMessageId?: string;
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => ConnectMessage;
  sendThreadReply: (parentMessageId: string, payload: {
    targetId: string;
    sender: ConnectUser;
    content: string;
    attachments?: ConnectMessage["attachments"];
  }) => ConnectMessage;
  toggleReaction: (targetId: string, messageId: string, emoji: string, userId: string) => void;
  togglePinMessage: (targetId: string, messageId: string) => void;
  deleteMessage: (targetId: string, messageId: string) => void;

  // Channel Actions
  createChannel: (channel: Omit<ConnectChannel, "id" | "createdAt">) => ConnectChannel;
  archiveChannel: (channelId: string) => void;
  leaveChannel: (channelId: string, userId: string) => void;

  // Call Actions
  startCall: (targetUser: ConnectUser, type: "audio" | "video") => void;
  receiveIncomingCall: (caller: ConnectUser, type: "audio" | "video") => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  endActiveCall: () => void;
  updateCallControls: (updates: Partial<Pick<ActiveCall, "isMuted" | "isCameraOff" | "isScreenSharing" | "isSpeakerOn">>) => void;
  incrementCallDuration: () => void;

  // Meeting Actions
  createMeeting: (meeting: Omit<ConnectMeeting, "id" | "status">) => ConnectMeeting;
  joinMeetingRoom: (meetingId: string, user: ConnectUser) => boolean;
  leaveMeetingRoom: () => void;
  updateMeetingStatus: (meetingId: string, status: ConnectMeeting["status"]) => void;

  // File Actions
  addSharedFile: (file: Omit<ConnectSharedFile, "id" | "sharedAt">) => ConnectSharedFile;
  removeSharedFile: (fileId: string) => void;

  // Presence & Notifications
  setCurrentUserPresence: (status: PresenceStatus) => void;
  setUserPresence: (userId: string, status: PresenceStatus) => void;
  addNotification: (notification: Omit<ConnectNotification, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;

  // Modals & Mail Artifact
  setIsNewChatOpen: (open: boolean) => void;
  setIsNewChannelOpen: (open: boolean) => void;
  setIsNewMeetingOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  openMailArtifact: (draft?: Partial<MailArtifactDraft>) => void;
  closeMailArtifact: () => void;
  updateMailArtifact: (draft: Partial<MailArtifactDraft>) => void;
}

export const useConnectStore = create<ConnectState>((set, get) => ({
  activeTab: "chat",
  activeConversationId: null,
  activeChannelId: null,
  activeMeetingId: null,
  activeThreadMessage: null,

  conversations: getStoredData<ConnectConversation[]>(STORAGE_KEYS.CONVERSATIONS, []),
  channels: getStoredData<ConnectChannel[]>(STORAGE_KEYS.CHANNELS, []),
  messages: getStoredData<Record<string, ConnectMessage[]>>(STORAGE_KEYS.MESSAGES, {}),
  meetings: getStoredData<ConnectMeeting[]>(STORAGE_KEYS.MEETINGS, []),
  sharedFiles: getStoredData<ConnectSharedFile[]>(STORAGE_KEYS.FILES, []),
  notifications: getStoredData<ConnectNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []),

  currentUserPresence: getStoredData<PresenceStatus>(STORAGE_KEYS.USER_PRESENCE, "online"),
  userPresenceMap: {},

  activeCall: null,
  incomingCall: null,
  currentMeetingRoom: null,
  isMeetingInSession: false,

  isNewChatOpen: false,
  isNewChannelOpen: false,
  isNewMeetingOpen: false,
  isSearchOpen: false,
  mailArtifact: null,
  isMailArtifactOpen: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setActiveChannelId: (id) => set({ activeChannelId: id }),
  setActiveMeetingId: (id) => set({ activeMeetingId: id }),
  setActiveThreadMessage: (activeThreadMessage) => set({ activeThreadMessage }),

  startDirectConversation: (targetUser) => {
    const existing = get().conversations.find((c) => c.participant.id === targetUser.id);
    if (existing) {
      set({ activeTab: "chat", activeConversationId: existing.id });
      return existing.id;
    }

    const newConvId = `conv_${Date.now()}_${targetUser.id}`;
    const newConv: ConnectConversation = {
      id: newConvId,
      participant: targetUser,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    const updated = [newConv, ...get().conversations];
    setStoredData(STORAGE_KEYS.CONVERSATIONS, updated);
    set({
      conversations: updated,
      activeTab: "chat",
      activeConversationId: newConvId,
    });
    return newConvId;
  },

  sendMessage: ({ targetId, sender, content, attachments, replyToMessageId, isVoiceMessage, voiceDuration }) => {
    const newMessage: ConnectMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: targetId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      attachments,
      replyToMessageId,
      isVoiceMessage,
      voiceDuration,
      reactions: [],
    };

    const currentMessages = get().messages[targetId] || [];
    const updatedMessages = {
      ...get().messages,
      [targetId]: [...currentMessages, newMessage],
    };

    // Update conversation lastMessage & timestamp if conversation
    const updatedConvs = get().conversations.map((c) =>
      c.id === targetId ? { ...c, lastMessage: newMessage, updatedAt: new Date().toISOString() } : c
    );

    setStoredData(STORAGE_KEYS.MESSAGES, updatedMessages);
    setStoredData(STORAGE_KEYS.CONVERSATIONS, updatedConvs);

    set({
      messages: updatedMessages,
      conversations: updatedConvs,
    });

    return newMessage;
  },

  sendThreadReply: (parentMessageId, { targetId, sender, content, attachments }) => {
    const replyMessage: ConnectMessage = {
      id: `msg_reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: targetId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      attachments,
      replyToMessageId: parentMessageId,
      reactions: [],
    };

    const currentMessages = get().messages[targetId] || [];
    const updatedMessagesList = currentMessages.map((m) => {
      if (m.id === parentMessageId) {
        return { ...m, replyCount: (m.replyCount || 0) + 1 };
      }
      return m;
    });

    const updatedMap = {
      ...get().messages,
      [targetId]: [...updatedMessagesList, replyMessage],
    };

    setStoredData(STORAGE_KEYS.MESSAGES, updatedMap);

    // Update active thread message if open
    const currentActiveThread = get().activeThreadMessage;
    const updatedActiveThread =
      currentActiveThread?.id === parentMessageId
        ? { ...currentActiveThread, replyCount: (currentActiveThread.replyCount || 0) + 1 }
        : currentActiveThread;

    set({
      messages: updatedMap,
      activeThreadMessage: updatedActiveThread,
    });

    return replyMessage;
  },

  toggleReaction: (targetId, messageId, emoji, userId) => {
    const list = get().messages[targetId] || [];
    const updatedList = list.map((msg) => {
      if (msg.id !== messageId) return msg;

      const currentReactions = msg.reactions || [];
      const existingReactionIndex = currentReactions.findIndex((r) => r.emoji === emoji);

      let newReactions = [...currentReactions];
      if (existingReactionIndex > -1) {
        const reaction = newReactions[existingReactionIndex];
        if (reaction.users.includes(userId)) {
          // Remove user reaction
          const filteredUsers = reaction.users.filter((u) => u !== userId);
          if (filteredUsers.length === 0) {
            newReactions.splice(existingReactionIndex, 1);
          } else {
            newReactions[existingReactionIndex] = {
              ...reaction,
              count: filteredUsers.length,
              users: filteredUsers,
            };
          }
        } else {
          // Add user reaction to existing emoji
          newReactions[existingReactionIndex] = {
            ...reaction,
            count: reaction.count + 1,
            users: [...reaction.users, userId],
          };
        }
      } else {
        // New reaction emoji
        newReactions.push({
          emoji,
          count: 1,
          users: [userId],
        });
      }

      return { ...msg, reactions: newReactions };
    });

    const updatedMap = { ...get().messages, [targetId]: updatedList };
    setStoredData(STORAGE_KEYS.MESSAGES, updatedMap);
    set({ messages: updatedMap });
  },

  togglePinMessage: (targetId, messageId) => {
    const list = get().messages[targetId] || [];
    const updatedList = list.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m));
    const updatedMap = { ...get().messages, [targetId]: updatedList };
    setStoredData(STORAGE_KEYS.MESSAGES, updatedMap);
    set({ messages: updatedMap });
  },

  deleteMessage: (targetId, messageId) => {
    const list = get().messages[targetId] || [];
    const updatedList = list.filter((m) => m.id !== messageId);
    const updatedMap = { ...get().messages, [targetId]: updatedList };
    setStoredData(STORAGE_KEYS.MESSAGES, updatedMap);
    set({ messages: updatedMap });
  },

  createChannel: (channelData) => {
    const newChannel: ConnectChannel = {
      id: `chn_${Date.now()}_${channelData.name.toLowerCase().replace(/\s+/g, "-")}`,
      createdAt: new Date().toISOString(),
      ...channelData,
    };

    const updated = [newChannel, ...get().channels];
    setStoredData(STORAGE_KEYS.CHANNELS, updated);
    set({
      channels: updated,
      activeTab: "channels",
      activeChannelId: newChannel.id,
      isNewChannelOpen: false,
    });
    return newChannel;
  },

  archiveChannel: (channelId) => {
    const updated = get().channels.map((c) => (c.id === channelId ? { ...c, isArchived: true } : c));
    setStoredData(STORAGE_KEYS.CHANNELS, updated);
    set({ channels: updated });
  },

  leaveChannel: (channelId, userId) => {
    const updated = get().channels.map((c) => {
      if (c.id === channelId) {
        return { ...c, members: c.members.filter((m) => m.id !== userId) };
      }
      return c;
    });
    setStoredData(STORAGE_KEYS.CHANNELS, updated);
    set({
      channels: updated,
      activeChannelId: get().activeChannelId === channelId ? null : get().activeChannelId,
    });
  },

  startCall: (targetUser, type) => {
    const newCall: ActiveCall = {
      id: `call_${Date.now()}`,
      type,
      targetUser,
      status: "calling",
      startTime: Date.now(),
      duration: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isSpeakerOn: true,
    };

    set({ activeCall: newCall });
    connectAudioManager.playOutgoingCall();
  },

  receiveIncomingCall: (caller, type) => {
    const incoming: ActiveCall = {
      id: `call_inc_${Date.now()}`,
      type,
      targetUser: caller,
      isIncoming: true,
      status: "ringing",
      duration: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
    };
    set({ incomingCall: incoming });
    connectAudioManager.playIncomingCall();
  },

  acceptIncomingCall: () => {
    const inc = get().incomingCall;
    if (!inc) return;
    set({
      incomingCall: null,
      activeCall: {
        ...inc,
        status: "connected",
        startTime: Date.now(),
      },
    });
    connectAudioManager.playCallConnected();
  },

  rejectIncomingCall: () => {
    connectAudioManager.playCallRejected();
    set({ incomingCall: null });
  },

  endActiveCall: () => {
    connectAudioManager.playCallEnded();
    set({ activeCall: null, incomingCall: null });
  },

  updateCallControls: (updates) => {
    const current = get().activeCall;
    if (!current) return;
    set({ activeCall: { ...current, ...updates } });
  },

  incrementCallDuration: () => {
    const current = get().activeCall;
    if (current && current.status === "connected") {
      set({ activeCall: { ...current, duration: current.duration + 1 } });
    }
  },

  createMeeting: (meetingData) => {
    const newMeeting: ConnectMeeting = {
      id: `meet_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      status: "scheduled",
      ...meetingData,
    };

    const updated = [newMeeting, ...get().meetings];
    setStoredData(STORAGE_KEYS.MEETINGS, updated);
    set({
      meetings: updated,
      isNewMeetingOpen: false,
      activeTab: "meetings",
    });
    return newMeeting;
  },

  joinMeetingRoom: (meetingId, user) => {
    let meeting = get().meetings.find((m) => m.id === meetingId);
    if (!meeting) {
      // Create ad-hoc instance for valid joining link if not stored
      meeting = {
        id: meetingId,
        title: `Meeting ${meetingId.toUpperCase()}`,
        hostId: user.id,
        hostName: user.name,
        startTime: new Date().toISOString(),
        participants: [user],
        isPrivate: false,
        allowScreenShare: true,
        allowMicrophone: true,
        allowCamera: true,
        status: "in_meeting",
      };
    }

    set({
      currentMeetingRoom: meeting,
      isMeetingInSession: true,
      activeMeetingId: meetingId,
    });
    return true;
  },

  leaveMeetingRoom: () => {
    set({
      currentMeetingRoom: null,
      isMeetingInSession: false,
    });
  },

  updateMeetingStatus: (meetingId, status) => {
    const updated = get().meetings.map((m) => (m.id === meetingId ? { ...m, status } : m));
    setStoredData(STORAGE_KEYS.MEETINGS, updated);
    set({ meetings: updated });
  },

  addSharedFile: (fileData) => {
    const newFile: ConnectSharedFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sharedAt: new Date().toLocaleDateString(),
      ...fileData,
    };

    const updated = [newFile, ...get().sharedFiles];
    setStoredData(STORAGE_KEYS.FILES, updated);
    set({ sharedFiles: updated });
    return newFile;
  },

  removeSharedFile: (fileId) => {
    const updated = get().sharedFiles.filter((f) => f.id !== fileId);
    setStoredData(STORAGE_KEYS.FILES, updated);
    set({ sharedFiles: updated });
  },

  setCurrentUserPresence: (status) => {
    setStoredData(STORAGE_KEYS.USER_PRESENCE, status);
    set({ currentUserPresence: status });
  },

  setUserPresence: (userId, status) => {
    set({
      userPresenceMap: { ...get().userPresenceMap, [userId]: status },
    });
  },

  addNotification: (notificationData) => {
    const newNotification: ConnectNotification = {
      id: `notif_${Date.now()}`,
      timestamp: "Just now",
      read: false,
      ...notificationData,
    };

    const updated = [newNotification, ...get().notifications];
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });

    // Sound notification trigger
    if (newNotification.type === "mention") {
      connectAudioManager.playMention({ eventId: newNotification.id });
    } else if (newNotification.type === "message") {
      connectAudioManager.playMessage({ eventId: newNotification.id });
    } else {
      connectAudioManager.playNotification({ eventId: newNotification.id });
    }
  },

  markNotificationAsRead: (notificationId) => {
    const updated = get().notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  clearAllNotifications: () => {
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, []);
    set({ notifications: [] });
  },

  setIsNewChatOpen: (isNewChatOpen) => set({ isNewChatOpen }),
  setIsNewChannelOpen: (isNewChannelOpen) => set({ isNewChannelOpen }),
  setIsNewMeetingOpen: (isNewMeetingOpen) => set({ isNewMeetingOpen }),
  setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),

  openMailArtifact: (draft) => {
    set({
      isMailArtifactOpen: true,
      mailArtifact: {
        to: draft?.to || "",
        cc: draft?.cc || "",
        bcc: draft?.bcc || "",
        subject: draft?.subject || "",
        body: draft?.body || "",
        attachments: draft?.attachments || [],
      },
    });
  },

  closeMailArtifact: () => set({ isMailArtifactOpen: false }),

  updateMailArtifact: (draft) => {
    const current = get().mailArtifact;
    if (!current) return;
    set({ mailArtifact: { ...current, ...draft } });
  },
}));
