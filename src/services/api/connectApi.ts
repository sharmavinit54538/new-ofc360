import { store } from "@/app/store";
import { baseApi } from "./baseApi";
import {
  ConnectUser,
  ConnectConversation,
  ConnectMessage,
  ConnectChannel,
  ChannelMember,
  CallHistoryItem,
  IceServersResponse,
  ConnectMeeting,
  ConnectSharedFile,
  ConnectNotification,
  ConnectSoundSettings,
  GetColleaguesParams,
  ColleaguesResponse,
  GlobalSearchParams,
  GlobalSearchResponse,
  CreateConversationRequest,
  GetConversationMessagesParams,
  SendMessageRequest,
  ToggleReactionRequest,
  CreateChannelRequest,
  UpdateChannelRequest,
  GetChannelMessagesParams,
  SendChannelMessageRequest,
  AddChannelMembersRequest,
  InitiateCallRequest,
  UpdateCallStatusRequest,
  CallSignalPayload,
  CreateMeetingRequest,
  JoinMeetingRequest,
  SendMeetingMessageRequest,
  UpdatePresenceRequest,
  BatchPresenceRequest,
  BatchPresenceResponse,
  AITransformRequest,
  AITransformResponse,
  MailDispatchRequest,
  MailDispatchResponse,
} from "@/types/connect";

function extractListFromEnvelope(response: any, keyNames: string[] = []): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.data && Array.isArray(response.data)) return response.data;

  for (const key of keyNames) {
    if (Array.isArray(response[key])) return response[key];
    if (response.data && Array.isArray(response.data[key])) return response.data[key];
  }

  if (response.items && Array.isArray(response.items)) return response.items;
  if (response.data?.items && Array.isArray(response.data.items)) return response.data.items;
  if (response.results && Array.isArray(response.results)) return response.results;
  if (response.data?.results && Array.isArray(response.data.results)) return response.data.results;
  if (response.colleagues && Array.isArray(response.colleagues)) return response.colleagues;
  if (response.data?.colleagues && Array.isArray(response.data.colleagues)) return response.data.colleagues;
  if (response.conversations && Array.isArray(response.conversations)) return response.conversations;
  if (response.data?.conversations && Array.isArray(response.data.conversations)) return response.data.conversations;
  if (response.messages && Array.isArray(response.messages)) return response.messages;
  if (response.data?.messages && Array.isArray(response.data.messages)) return response.data.messages;

  return [];
}

export function normalizeConnectUser(raw: any): ConnectUser {
  if (!raw) {
    return { id: "usr_unknown", name: "User", email: "" };
  }
  const id = String(raw.id || raw._id || raw.userId || raw.user_id || `usr_${Math.random().toString(36).slice(2)}`);

  let name = "";
  if (raw.name && typeof raw.name === "string" && raw.name.trim() && raw.name.toLowerCase() !== "colleague" && raw.name.toLowerCase() !== "user") {
    name = raw.name.trim();
  } else if (raw.full_name && typeof raw.full_name === "string" && raw.full_name.trim()) {
    name = raw.full_name.trim();
  } else if (raw.fullName && typeof raw.fullName === "string" && raw.fullName.trim()) {
    name = raw.fullName.trim();
  } else if ((raw.displayName || raw.display_name) && typeof (raw.displayName || raw.display_name) === "string") {
    name = (raw.displayName || raw.display_name).trim();
  } else if (raw.first_name || raw.firstName) {
    name = `${raw.first_name || raw.firstName || ""} ${raw.last_name || raw.lastName || ""}`.trim();
  } else if (raw.email && typeof raw.email === "string" && raw.email.includes("@")) {
    name = raw.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  } else if (raw.username && typeof raw.username === "string" && raw.username.trim()) {
    name = raw.username.trim();
  } else {
    name = raw.name || "Colleague";
  }

  const email = raw.email || raw.emailAddress || raw.email_address || "";
  const role = raw.role || raw.designation || raw.job_title || raw.title || "Team Member";
  const department = raw.department || raw.dept || raw.departmentName || "General";
  const avatar = raw.avatar || raw.avatar_url || raw.avatarUrl || raw.photoUrl || raw.photo_url || raw.profile_picture || undefined;
  const presence = raw.presence || raw.status || "online";

  return {
    id,
    name,
    email,
    role,
    department,
    avatar,
    presence,
  };
}

export function normalizeConnectMessage(raw: any, defaultConversationId?: string): ConnectMessage {
  if (!raw) {
    return {
      id: `msg_${Date.now()}`,
      conversationId: defaultConversationId || "",
      senderId: "usr_unknown",
      senderName: "",
      content: "",
      timestamp: new Date().toISOString(),
    };
  }

  const id = String(raw.id || raw._id || raw.messageId || raw.message_id || `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const conversationId = String(raw.conversationId || raw.conversation_id || defaultConversationId || "");
  const senderId = String(raw.senderId || raw.sender_id || raw.userId || raw.user_id || raw.sender?.id || raw.sender?._id || "usr_unknown");

  let senderName = raw.senderName || raw.sender_name || raw.sender?.name || raw.user?.name;
  if (!senderName && raw.sender && typeof raw.sender === "object") {
    senderName = normalizeConnectUser(raw.sender).name;
  }
  if (!senderName) {
    senderName = "";
  }

  const senderAvatar = raw.senderAvatar || raw.sender_avatar || raw.sender?.avatar || raw.sender?.avatar_url || raw.user?.avatar;
  const content = String(raw.content || raw.message || raw.text || raw.body || "");
  const timestamp = raw.timestamp || raw.created_at || raw.createdAt || new Date().toISOString();

  const attachments = Array.isArray(raw.attachments) ? raw.attachments : Array.isArray(raw.files) ? raw.files : [];
  const reactions = Array.isArray(raw.reactions) ? raw.reactions : [];
  const isPinned = Boolean(raw.isPinned ?? raw.is_pinned ?? raw.pinned ?? false);
  const isVoiceMessage = Boolean(raw.isVoiceMessage ?? raw.is_voice_message ?? false);
  const voiceDuration = raw.voiceDuration ?? raw.voice_duration;
  const status = raw.status || "delivered";

  return {
    id,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    content,
    timestamp,
    attachments,
    reactions,
    isPinned,
    isVoiceMessage,
    voiceDuration,
    status,
  };
}

export function isCurrentUser(target: any, currentUser?: any): boolean {
  if (!target) return false;
  const user = currentUser || store.getState().auth.user;
  if (!user) return false;

  const currentIds = new Set<string>();
  if (user.id) currentIds.add(String(user.id).trim());
  if (user._id) currentIds.add(String(user._id).trim());
  if (user.userId) currentIds.add(String(user.userId).trim());
  if (user.user_id) currentIds.add(String(user.user_id).trim());
  if (user.employee_id) currentIds.add(String(user.employee_id).trim());
  if (user.employeeId) currentIds.add(String(user.employeeId).trim());

  const currentEmail = (user.email || user.emailAddress || "").toLowerCase().trim();

  if (typeof target === "string" || typeof target === "number") {
    const str = String(target).trim();
    if (currentIds.has(str)) return true;
    if (currentEmail && str.toLowerCase() === currentEmail) return true;
    return false;
  }

  if (typeof target === "object") {
    const tId = String(
      target.id ||
      target._id ||
      target.userId ||
      target.user_id ||
      target.employee_id ||
      target.employeeId ||
      ""
    ).trim();
    if (tId && currentIds.has(tId)) return true;
    const tEmail = (target.email || target.emailAddress || "").toLowerCase().trim();
    if (currentEmail && tEmail && tEmail === currentEmail) return true;
  }

  return false;
}

export function normalizeConnectConversation(raw: any, currentUser?: any): ConnectConversation {
  const id = String(
    raw.id ||
    raw._id ||
    raw.conversationId ||
    raw.conversation_id ||
    `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  const authUser = currentUser || store.getState().auth.user;

  // 1. Check participants array: find the participant who is NOT the current user
  let rawParticipant: any = null;

  if (Array.isArray(raw.participants) && raw.participants.length > 0) {
    const other = raw.participants.find((p: any) => p && typeof p === "object" && !isCurrentUser(p, authUser));
    if (other) {
      rawParticipant = other;
    }
  }

  // 2. Check candidate properties that are NOT the current user
  if (!rawParticipant) {
    const candidates = [
      raw.other_user,
      raw.otherUser,
      raw.recipient,
      raw.target_user,
      raw.targetUser,
      raw.colleague,
      raw.participant,
      raw.user,
      raw.sender,
      raw.receiver,
    ];
    for (const c of candidates) {
      if (c && typeof c === "object" && !isCurrentUser(c, authUser)) {
        rawParticipant = c;
        break;
      }
    }
  }

  // 3. Check sender / receiver pairs
  if (!rawParticipant) {
    if (raw.sender && isCurrentUser(raw.sender, authUser) && raw.receiver) {
      rawParticipant = raw.receiver;
    } else if (raw.receiver && isCurrentUser(raw.receiver, authUser) && raw.sender) {
      rawParticipant = raw.sender;
    }
  }

  // 4. Fallback: if raw itself contains non-current user details or if nothing else matches
  if (!rawParticipant) {
    if (raw.participant && typeof raw.participant === "object" && !isCurrentUser(raw.participant, authUser)) {
      rawParticipant = raw.participant;
    } else {
      rawParticipant = raw.participant || raw.user || raw;
    }
  }

  const participant = normalizeConnectUser(rawParticipant);

  let lastMessage: ConnectMessage | undefined;
  if (raw.lastMessage && typeof raw.lastMessage === "object") {
    lastMessage = normalizeConnectMessage(raw.lastMessage, id);
  } else if (raw.last_message && typeof raw.last_message === "object") {
    lastMessage = normalizeConnectMessage(raw.last_message, id);
  } else if (raw.latest_message && typeof raw.latest_message === "object") {
    lastMessage = normalizeConnectMessage(raw.latest_message, id);
  } else if (typeof raw.lastMessage === "string" || typeof raw.last_message === "string") {
    lastMessage = {
      id: `msg_last_${id}`,
      conversationId: id,
      senderId: participant.id,
      senderName: participant.name,
      content: String(raw.lastMessage || raw.last_message),
      timestamp: raw.updatedAt || raw.updated_at || new Date().toISOString(),
    };
  }

  const unreadCount = Number(raw.unreadCount ?? raw.unread_count ?? raw.unread ?? 0);
  const isPinned = Boolean(raw.isPinned ?? raw.is_pinned ?? raw.pinned ?? false);
  const isMuted = Boolean(raw.isMuted ?? raw.is_muted ?? raw.muted ?? false);
  const updatedAt = raw.updatedAt || raw.updated_at || lastMessage?.timestamp || new Date().toISOString();

  return {
    id,
    participant,
    lastMessage,
    unreadCount,
    isPinned,
    isMuted,
    updatedAt,
  };
}

export const connectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. User Directory & Global Search
    // ==========================================
    getColleagues: builder.query<ColleaguesResponse | ConnectUser[], GetColleaguesParams | void>({
      query: (params) => ({
        url: "/api/v1/connect/colleagues",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        console.log("[CHAT_API] GET /api/v1/connect/colleagues response:", response);
        const list = extractListFromEnvelope(response, ["colleagues"]);
        const normalized = list.map(normalizeConnectUser);
        console.log(`[CHAT_API] Normalized ${normalized.length} colleagues.`);
        return normalized;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              "Colleagues",
              ...result.map(({ id }) => ({ type: "Colleagues" as const, id })),
            ]
          : ["Colleagues"],
    }),

    globalSearch: builder.query<GlobalSearchResponse, GlobalSearchParams>({
      query: (params) => ({
        url: "/api/v1/connect/search",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        const raw = response?.data || response;
        return {
          people: Array.isArray(raw?.people) ? raw.people.map(normalizeConnectUser) : [],
          channels: raw?.channels || [],
          messages: raw?.messages || [],
          files: raw?.files || [],
        };
      },
      providesTags: ["Search"],
    }),

    // ==========================================
    // 2. Direct Messaging
    // ==========================================
    getConversations: builder.query<ConnectConversation[], { search?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/api/v1/connect/conversations",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        console.log("[CHAT_API] GET /api/v1/connect/conversations response:", response);
        const list = extractListFromEnvelope(response, ["conversations"]);
        const currentUser = store.getState().auth.user;

        // Deduplicate conversations by unique conversation ID
        const convMap = new Map<string, ConnectConversation>();
        for (const item of list) {
          const conv = normalizeConnectConversation(item, currentUser);
          if (!convMap.has(conv.id)) {
            convMap.set(conv.id, conv);
          } else {
            const existing = convMap.get(conv.id)!;
            const timeExisting = new Date(existing.updatedAt || 0).getTime();
            const timeNew = new Date(conv.updatedAt || 0).getTime();
            if (timeNew > timeExisting) {
              convMap.set(conv.id, conv);
            }
          }
        }

        const normalized = Array.from(convMap.values());

        // Sort: Pinned first, then by updatedAt descending
        normalized.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const timeA = new Date(a.updatedAt || a.lastMessage?.timestamp || 0).getTime();
          const timeB = new Date(b.updatedAt || b.lastMessage?.timestamp || 0).getTime();
          return timeB - timeA;
        });

        console.log(`[CHAT_CONVERSATIONS] Fetched and normalized ${normalized.length} direct conversations:`, normalized);
        return normalized;
      },
      providesTags: (result) =>
        result
          ? [
              "Conversations",
              ...result.map(({ id }) => ({ type: "Conversations" as const, id })),
            ]
          : ["Conversations"],
    }),

    createConversation: builder.mutation<ConnectConversation, CreateConversationRequest>({
      query: (body) => {
        console.log("[CHAT_API] POST /api/v1/connect/conversations request:", body);
        return {
          url: "/api/v1/connect/conversations",
          method: "POST",
          body: {
            targetUserId: body.targetUserId,
            target_user_id: body.targetUserId,
            participantId: body.targetUserId,
            participant_id: body.targetUserId,
            recipientId: body.targetUserId,
            recipient_id: body.targetUserId,
            userId: body.targetUserId,
            user_id: body.targetUserId,
          },
        };
      },
      transformResponse: (response: any) => {
        console.log("[CHAT_API] POST /api/v1/connect/conversations response:", response);
        const raw = response?.data || response?.conversation || response;
        return normalizeConnectConversation(raw);
      },
      invalidatesTags: ["Conversations"],
    }),

    getConversationMessages: builder.query<ConnectMessage[], GetConversationMessagesParams>({
      query: ({ conversationId, ...params }) => ({
        url: `/api/v1/connect/conversations/${conversationId}/messages`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any, _meta, arg) => {
        console.log(`[CHAT_API] GET /api/v1/connect/conversations/${arg.conversationId}/messages response:`, response);
        const list = extractListFromEnvelope(response, ["messages", "conversation_messages"]);
        const normalized = list.map((m) => normalizeConnectMessage(m, arg.conversationId));

        // Sort messages chronologically (oldest -> newest) for correct chat view
        normalized.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime() || 0;
          const timeB = new Date(b.timestamp).getTime() || 0;
          return timeA - timeB;
        });

        console.log(`[CHAT_MESSAGES] Normalized ${normalized.length} messages for conversation ${arg.conversationId}`);
        return normalized;
      },
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<ConnectMessage, SendMessageRequest>({
      query: ({ conversationId, ...body }) => {
        console.log(`[CHAT_SEND] Sending message to conversation ${conversationId}:`, body.content);
        return {
          url: `/api/v1/connect/conversations/${conversationId}/messages`,
          method: "POST",
          body: {
            content: body.content,
            message: body.content, // alias for backend compatibility
            attachments: body.attachments,
            isVoiceMessage: body.isVoiceMessage,
            is_voice_message: body.isVoiceMessage,
            voiceDuration: body.voiceDuration,
            voice_duration: body.voiceDuration,
            replyToMessageId: body.replyToMessageId,
            reply_to_message_id: body.replyToMessageId,
          },
        };
      },
      transformResponse: (response: any, _meta, arg) => {
        const raw = response?.data || response?.message || response;
        return normalizeConnectMessage(raw, arg.conversationId);
      },
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),

    markConversationRead: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/api/v1/connect/conversations/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Conversations"],
    }),

    pinConversation: builder.mutation<ConnectConversation, { conversationId: string; isPinned: boolean }>({
      query: ({ conversationId, isPinned }) => ({
        url: `/api/v1/connect/conversations/${conversationId}/pin`,
        method: "PATCH",
        body: { isPinned },
      }),
      invalidatesTags: ["Conversations"],
    }),

    muteConversation: builder.mutation<ConnectConversation, { conversationId: string; isMuted: boolean }>({
      query: ({ conversationId, isMuted }) => ({
        url: `/api/v1/connect/conversations/${conversationId}/mute`,
        method: "PATCH",
        body: { isMuted },
      }),
      invalidatesTags: ["Conversations"],
    }),

    // ==========================================
    // 3. Message Actions
    // ==========================================
    toggleReaction: builder.mutation<ConnectMessage, { messageId: string; emoji: string; conversationId?: string }>({
      query: ({ messageId, emoji }) => ({
        url: `/api/v1/connect/messages/${messageId}/reactions`,
        method: "POST",
        body: { emoji },
      }),
      invalidatesTags: (_result, _error, { conversationId }) =>
        conversationId ? [{ type: "Messages", id: conversationId }] : ["Messages"],
    }),

    pinMessage: builder.mutation<ConnectMessage, { messageId: string; isPinned: boolean; conversationId?: string }>({
      query: ({ messageId, isPinned }) => ({
        url: `/api/v1/connect/messages/${messageId}/pin`,
        method: "PATCH",
        body: { isPinned },
      }),
      invalidatesTags: (_result, _error, { conversationId }) =>
        conversationId ? [{ type: "Messages", id: conversationId }] : ["Messages"],
    }),

    deleteMessage: builder.mutation<{ success: boolean; messageId: string }, { messageId: string; conversationId?: string }>({
      query: ({ messageId }) => ({
        url: `/api/v1/connect/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { conversationId }) =>
        conversationId ? [{ type: "Messages", id: conversationId }] : ["Messages"],
    }),

    editMessage: builder.mutation<ConnectMessage, { messageId: string; content: string; conversationId?: string }>({
      query: ({ messageId, content }) => ({
        url: `/api/v1/connect/messages/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { conversationId }) =>
        conversationId ? [{ type: "Messages", id: conversationId }] : ["Messages"],
    }),

    getMessageThread: builder.query<ConnectMessage[], string>({
      query: (parentMessageId) => ({
        url: `/api/v1/connect/messages/${parentMessageId}/thread`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.replies && Array.isArray(response.replies)) return response.replies;
        return [];
      },
      providesTags: (_result, _error, parentMessageId) => [
        { type: "Threads", id: parentMessageId },
      ],
    }),

    postThreadReply: builder.mutation<ConnectMessage, { parentMessageId: string; content: string; attachments?: any[]; conversationId?: string }>({
      query: ({ parentMessageId, content, attachments }) => ({
        url: `/api/v1/connect/messages/${parentMessageId}/thread`,
        method: "POST",
        body: { content, attachments },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { parentMessageId, conversationId }) => [
        { type: "Threads", id: parentMessageId },
        ...(conversationId ? [{ type: "Messages" as const, id: conversationId }] : []),
      ],
    }),

    // ==========================================
    // 4. Team Channels
    // ==========================================
    getChannels: builder.query<ConnectChannel[], void>({
      query: () => ({
        url: "/api/v1/connect/channels",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.channels && Array.isArray(response.channels)) return response.channels;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              "Channels",
              ...result.map(({ id }) => ({ type: "Channels" as const, id })),
            ]
          : ["Channels"],
    }),

    createChannel: builder.mutation<ConnectChannel, CreateChannelRequest>({
      query: (body) => ({
        url: "/api/v1/connect/channels",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Channels"],
    }),

    getChannel: builder.query<ConnectChannel, string>({
      query: (channelId) => ({
        url: `/api/v1/connect/channels/${channelId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, channelId) => [{ type: "Channels", id: channelId }],
    }),

    updateChannel: builder.mutation<ConnectChannel, UpdateChannelRequest>({
      query: ({ channelId, ...body }) => ({
        url: `/api/v1/connect/channels/${channelId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { channelId }) => [
        { type: "Channels", id: channelId },
        "Channels",
      ],
    }),

    getChannelMessages: builder.query<ConnectMessage[], GetChannelMessagesParams>({
      query: ({ channelId, ...params }) => ({
        url: `/api/v1/connect/channels/${channelId}/messages`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.messages && Array.isArray(response.messages)) return response.messages;
        return [];
      },
      providesTags: (_result, _error, { channelId }) => [{ type: "Messages", id: channelId }],
    }),

    sendChannelMessage: builder.mutation<ConnectMessage, SendChannelMessageRequest>({
      query: ({ channelId, ...body }) => ({
        url: `/api/v1/connect/channels/${channelId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { channelId }) => [
        { type: "Messages", id: channelId },
        "Channels",
      ],
    }),

    addChannelMembers: builder.mutation<ConnectChannel, AddChannelMembersRequest>({
      query: ({ channelId, memberIds }) => ({
        url: `/api/v1/connect/channels/${channelId}/members`,
        method: "POST",
        body: { memberIds },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { channelId }) => [
        { type: "Channels", id: channelId },
        "Channels",
      ],
    }),

    removeChannelMember: builder.mutation<{ success: boolean }, { channelId: string; userId: string }>({
      query: ({ channelId, userId }) => ({
        url: `/api/v1/connect/channels/${channelId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { channelId }) => [
        { type: "Channels", id: channelId },
        "Channels",
      ],
    }),

    leaveChannel: builder.mutation<{ success: boolean }, string>({
      query: (channelId) => ({
        url: `/api/v1/connect/channels/${channelId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Channels"],
    }),

    archiveChannel: builder.mutation<ConnectChannel, { channelId: string; isArchived?: boolean }>({
      query: ({ channelId, isArchived = true }) => ({
        url: `/api/v1/connect/channels/${channelId}/archive`,
        method: "PATCH",
        body: { isArchived },
      }),
      invalidatesTags: (_result, _error, { channelId }) => [
        { type: "Channels", id: channelId },
        "Channels",
      ],
    }),

    // ==========================================
    // 5. Audio / Video Calls
    // ==========================================
    getCallHistory: builder.query<CallHistoryItem[], { limit?: number; page?: number } | void>({
      query: (params) => ({
        url: "/api/v1/connect/calls/history",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.calls && Array.isArray(response.calls)) return response.calls;
        return [];
      },
      providesTags: ["Calls"],
    }),

    initiateCall: builder.mutation<{ callId: string; status: string }, InitiateCallRequest>({
      query: (body) => ({
        url: "/api/v1/connect/calls/initiate",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Calls"],
    }),

    updateCallStatus: builder.mutation<{ success: boolean }, UpdateCallStatusRequest>({
      query: ({ callId, ...body }) => ({
        url: `/api/v1/connect/calls/${callId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Calls"],
    }),

    sendCallSignal: builder.mutation<{ success: boolean }, CallSignalPayload>({
      query: ({ callId, ...body }) => ({
        url: `/api/v1/connect/calls/${callId}/signal`,
        method: "POST",
        body,
      }),
    }),

    getIceServers: builder.query<IceServersResponse, void>({
      query: () => ({
        url: "/api/v1/connect/calls/ice-servers",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const raw = response?.data || response;
        if (raw?.iceServers) return raw;
        return {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        };
      },
      providesTags: ["Calls"],
    }),

    // ==========================================
    // 6. Video Meetings
    // ==========================================
    getMeetings: builder.query<ConnectMeeting[], { status?: string } | void>({
      query: (params) => ({
        url: "/api/v1/connect/meetings",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.meetings && Array.isArray(response.meetings)) return response.meetings;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              "Meetings",
              ...result.map(({ id }) => ({ type: "Meetings" as const, id })),
            ]
          : ["Meetings"],
    }),

    createMeeting: builder.mutation<ConnectMeeting, CreateMeetingRequest>({
      query: (body) => ({
        url: "/api/v1/connect/meetings",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Meetings"],
    }),

    getMeeting: builder.query<ConnectMeeting, string>({
      query: (meetingId) => ({
        url: `/api/v1/connect/meetings/${meetingId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, meetingId) => [{ type: "Meetings", id: meetingId }],
    }),

    joinMeeting: builder.mutation<{ success: boolean; meeting: ConnectMeeting }, JoinMeetingRequest>({
      query: ({ meetingId, ...body }) => ({
        url: `/api/v1/connect/meetings/${meetingId}/join`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { meetingId }) => [
        { type: "Meetings", id: meetingId },
        "MeetingParticipants",
      ],
    }),

    leaveMeeting: builder.mutation<{ success: boolean }, string>({
      query: (meetingId) => ({
        url: `/api/v1/connect/meetings/${meetingId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["MeetingParticipants"],
    }),

    getMeetingMessages: builder.query<ConnectMessage[], string>({
      query: (meetingId) => ({
        url: `/api/v1/connect/meetings/${meetingId}/messages`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.messages && Array.isArray(response.messages)) return response.messages;
        return [];
      },
      providesTags: (_result, _error, meetingId) => [{ type: "Messages", id: meetingId }],
    }),

    sendMeetingMessage: builder.mutation<ConnectMessage, SendMeetingMessageRequest>({
      query: ({ meetingId, ...body }) => ({
        url: `/api/v1/connect/meetings/${meetingId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { meetingId }) => [{ type: "Messages", id: meetingId }],
    }),

    getMeetingParticipants: builder.query<ConnectUser[], string>({
      query: (meetingId) => ({
        url: `/api/v1/connect/meetings/${meetingId}/participants`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.participants && Array.isArray(response.participants)) return response.participants;
        return [];
      },
      providesTags: ["MeetingParticipants"],
    }),

    // ==========================================
    // 7. Shared Files
    // ==========================================
    getFiles: builder.query<ConnectSharedFile[], { category?: string; search?: string; conversationId?: string; channelId?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/api/v1/connect/files",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.files && Array.isArray(response.files)) return response.files;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              "Files",
              ...result.map(({ id }) => ({ type: "Files" as const, id })),
            ]
          : ["Files"],
    }),

    uploadFile: builder.mutation<ConnectSharedFile, FormData>({
      query: (formData) => ({
        url: "/api/v1/connect/files/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Files"],
    }),

    getFile: builder.query<ConnectSharedFile, string>({
      query: (fileId) => ({
        url: `/api/v1/connect/files/${fileId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, fileId) => [{ type: "Files", id: fileId }],
    }),

    deleteFile: builder.mutation<{ success: boolean; fileId: string }, string>({
      query: (fileId) => ({
        url: `/api/v1/connect/files/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Files"],
    }),

    // ==========================================
    // 8. Presence
    // ==========================================
    updatePresence: builder.mutation<ConnectUser, UpdatePresenceRequest>({
      query: (body) => ({
        url: "/api/v1/connect/presence",
        method: "PUT",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Presence"],
    }),

    getBatchPresence: builder.mutation<BatchPresenceResponse, BatchPresenceRequest>({
      query: (body) => ({
        url: "/api/v1/connect/presence/batch",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),

    // ==========================================
    getNotifications: builder.query<ConnectNotification[], { unreadOnly?: boolean; limit?: number } | void>({
      query: (params) => ({
        url: "/api/v1/connect/notifications",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        let rawList: any[] = [];
        if (Array.isArray(response)) rawList = response;
        else if (response?.data && Array.isArray(response.data)) rawList = response.data;
        else if (response?.notifications && Array.isArray(response.notifications)) rawList = response.notifications;

        return rawList.map((item: any): ConnectNotification => {
          const rawType = item.type || (item.channelId || item.channel_name || item.channel_id ? "channel" : "message");
          const channelName =
            item.channelName ||
            item.channel_name ||
            item.channel?.name ||
            item.targetName ||
            item.target_name ||
            "";
          const channelId = item.channelId || item.channel_id || item.channel?.id;
          const conversationId = item.conversationId || item.conversation_id;

          const senderName =
            item.sender?.name ||
            item.sender_name ||
            item.senderName ||
            item.userName ||
            item.user_name ||
            item.user?.name ||
            "";

          const rawContent =
            item.description ||
            item.content ||
            item.message ||
            item.body ||
            item.text ||
            item.preview ||
            item.snippet ||
            item.data?.content ||
            item.data?.message ||
            "";

          let title = item.title;
          if (!title) {
            if (channelName) {
              title = senderName ? `${senderName} in #${channelName}` : `New message in #${channelName}`;
            } else if (senderName) {
              title = `New message from ${senderName}`;
            } else {
              title = "New message";
            }
          }

          return {
            id: String(item.id || item._id || `notif_${Math.random().toString(36).slice(2)}`),
            type: rawType,
            title,
            description: rawContent,
            timestamp: item.timestamp || item.created_at || item.createdAt || new Date().toISOString(),
            read: Boolean(item.read || item.is_read || item.isRead),
            link:
              item.link ||
              (channelId
                ? `/connect/channels/${channelId}`
                : conversationId
                ? `/connect/chat/${conversationId}`
                : "/connect/chat"),
            sender: item.sender || (senderName ? { id: item.sender_id || item.senderId || "usr_sender", name: senderName, email: "" } : undefined),
            channelId,
            channelName,
            conversationId,
            content: rawContent,
          };
        });
      },
      providesTags: ["Notifications"],
    }),

    markNotificationRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: `/api/v1/connect/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    clearNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/api/v1/connect/notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ==========================================
    // 10. Sound Settings
    // ==========================================
    getSoundSettings: builder.query<ConnectSoundSettings, void>({
      query: () => ({
        url: "/api/v1/connect/settings/sound",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const raw = response?.data || response;
        return {
          isMasterEnabled: raw?.isMasterEnabled ?? true,
          isIncomingCallsEnabled: raw?.isIncomingCallsEnabled ?? true,
          isOutgoingCallsEnabled: raw?.isOutgoingCallsEnabled ?? true,
          isMessagesEnabled: raw?.isMessagesEnabled ?? true,
          isMentionsEnabled: raw?.isMentionsEnabled ?? true,
          isGroupMessagesEnabled: raw?.isGroupMessagesEnabled ?? true,
          isChannelMessagesEnabled: raw?.isChannelMessagesEnabled ?? true,
          isMeetingSoundsEnabled: raw?.isMeetingSoundsEnabled ?? true,
          isParticipantJoinLeaveEnabled: raw?.isParticipantJoinLeaveEnabled ?? true,
          masterVolume: raw?.masterVolume ?? 70,
          isMutedAll: raw?.isMutedAll ?? false,
        };
      },
      providesTags: ["SoundSettings"],
    }),

    updateSoundSettings: builder.mutation<ConnectSoundSettings, Partial<ConnectSoundSettings>>({
      query: (body) => ({
        url: "/api/v1/connect/settings/sound",
        method: "PUT",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["SoundSettings"],
    }),

    // ==========================================
    // 11. AI Copilot
    // ==========================================
    aiTransform: builder.mutation<AITransformResponse, AITransformRequest>({
      query: (body) => ({
        url: "/api/v1/connect/ai/transform",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),

    // ==========================================
    // 12. Mail Artifact
    // ==========================================
    dispatchMail: builder.mutation<MailDispatchResponse, MailDispatchRequest>({
      query: (body) => ({
        url: "/api/v1/connect/mail/dispatch",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  // Category 1: User Directory & Global Search
  useGetColleaguesQuery,
  useLazyGetColleaguesQuery,
  useGlobalSearchQuery,
  useLazyGlobalSearchQuery,

  // Category 2: Direct Messaging
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  usePinConversationMutation,
  useMuteConversationMutation,

  // Category 3: Message Actions
  useToggleReactionMutation,
  usePinMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useGetMessageThreadQuery,
  useLazyGetMessageThreadQuery,
  usePostThreadReplyMutation,

  // Category 4: Team Channels
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useGetChannelQuery,
  useLazyGetChannelQuery,
  useUpdateChannelMutation,
  useGetChannelMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useSendChannelMessageMutation,
  useAddChannelMembersMutation,
  useRemoveChannelMemberMutation,
  useLeaveChannelMutation,
  useArchiveChannelMutation,

  // Category 5: Audio / Video Calls
  useGetCallHistoryQuery,
  useLazyGetCallHistoryQuery,
  useInitiateCallMutation,
  useUpdateCallStatusMutation,
  useSendCallSignalMutation,
  useGetIceServersQuery,
  useLazyGetIceServersQuery,

  // Category 6: Video Meetings
  useGetMeetingsQuery,
  useLazyGetMeetingsQuery,
  useCreateMeetingMutation,
  useGetMeetingQuery,
  useLazyGetMeetingQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
  useGetMeetingMessagesQuery,
  useLazyGetMeetingMessagesQuery,
  useSendMeetingMessageMutation,
  useGetMeetingParticipantsQuery,
  useLazyGetMeetingParticipantsQuery,

  // Category 7: Shared Files
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useUploadFileMutation,
  useGetFileQuery,
  useLazyGetFileQuery,
  useDeleteFileMutation,

  // Category 8: Presence
  useUpdatePresenceMutation,
  useGetBatchPresenceMutation,

  // Category 9: Notifications
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useClearNotificationsMutation,

  // Category 10: Sound Settings
  useGetSoundSettingsQuery,
  useLazyGetSoundSettingsQuery,
  useUpdateSoundSettingsMutation,

  // Category 11: AI Copilot
  useAiTransformMutation,

  // Category 12: Mail Artifact
  useDispatchMailMutation,
} = connectApi;

// Convenience alias hooks for direct component consumption
export const useGetConnectNotificationsQuery = connectApi.endpoints.getNotifications.useQuery;
export const useLazyGetConnectNotificationsQuery = connectApi.endpoints.getNotifications.useLazyQuery;
export const useClearAllNotificationsMutation = connectApi.endpoints.clearNotifications.useMutation;
export const useUpdateMyPresenceMutation = connectApi.endpoints.updatePresence.useMutation;
export const useGetCallLogsQuery = connectApi.endpoints.getCallHistory.useQuery;
export const useLazyGetCallLogsQuery = connectApi.endpoints.getCallHistory.useLazyQuery;
export const useEndCallMutation = connectApi.endpoints.updateCallStatus.useMutation;
export const useAcceptCallMutation = connectApi.endpoints.updateCallStatus.useMutation;
export const useRejectCallMutation = connectApi.endpoints.updateCallStatus.useMutation;
export const useEndMeetingMutation = connectApi.endpoints.leaveMeeting.useMutation;
export const useGetMeetingFilesQuery = connectApi.endpoints.getFiles.useQuery;
export const useShareMeetingFileMutation = connectApi.endpoints.uploadFile.useMutation;
export const useStartScreenShareMutation = connectApi.endpoints.aiTransform.useMutation;
export const useStopScreenShareMutation = connectApi.endpoints.aiTransform.useMutation;
export const useGenerateAiMeetingSummaryMutation = connectApi.endpoints.aiTransform.useMutation;

