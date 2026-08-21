import { baseApi } from "../baseApi";
import { ConnectMessage, GetConversationMessagesParams, SendMessageRequest } from "@/types/connect";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationMessages: builder.query<ConnectMessage[], { conversationId: string } & GetConversationMessagesParams>({
      query: ({ conversationId, ...params }) => ({ url: `/api/v1/connect/conversations/${conversationId}/messages`, params }),
      transformResponse: (raw: any): ConnectMessage[] => extractListFromEnvelope(raw, ["messages"]).map((m) => normalizeConnectMessage(m)),
      providesTags: (_r, _e, { conversationId }) => [{ type: "ConnectMessages", id: conversationId }],
    }),
    sendMessage: builder.mutation<ConnectMessage, { conversationId: string } & SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({ url: `/api/v1/connect/conversations/${conversationId}/messages`, method: "POST", body }),
      transformResponse: (raw: any) => normalizeConnectMessage(raw?.data || raw),
      invalidatesTags: (_r, _e, { conversationId }) => [{ type: "ConnectMessages", id: conversationId }, "ConnectConversations"],
    }),
    editMessage: builder.mutation<ConnectMessage, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({ url: `/api/v1/connect/messages/${messageId}`, method: "PUT", body: { content } }),
      transformResponse: (raw: any) => normalizeConnectMessage(raw?.data || raw),
      invalidatesTags: ["ConnectMessages"],
    }),
  }),
});
export const { useGetConversationMessagesQuery, useSendMessageMutation, useEditMessageMutation } = connectMessagesApi;
