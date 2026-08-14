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
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.colleagues && Array.isArray(response.colleagues)) return response;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              "Colleagues",
              ...(Array.isArray(result)
                ? result.map(({ id }) => ({ type: "Colleagues" as const, id }))
                : result.colleagues.map(({ id }) => ({ type: "Colleagues" as const, id }))),
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
          people: raw?.people || [],
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
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.conversations && Array.isArray(response.conversations)) return response.conversations;
        return [];
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
      query: (body) => ({
        url: "/api/v1/connect/conversations",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Conversations"],
    }),

    getConversationMessages: builder.query<ConnectMessage[], GetConversationMessagesParams>({
      query: ({ conversationId, ...params }) => ({
        url: `/api/v1/connect/conversations/${conversationId}/messages`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.messages && Array.isArray(response.messages)) return response.messages;
        return [];
      },
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<ConnectMessage, SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/api/v1/connect/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
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
    // 9. Notifications
    // ==========================================
    getNotifications: builder.query<ConnectNotification[], { unreadOnly?: boolean; limit?: number } | void>({
      query: (params) => ({
        url: "/api/v1/connect/notifications",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.notifications && Array.isArray(response.notifications)) return response.notifications;
        return [];
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

