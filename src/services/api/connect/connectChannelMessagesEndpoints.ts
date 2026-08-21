import { baseApi } from "../baseApi";
import { ConnectMessage, GetChannelMessagesParams, SendChannelMessageRequest, ToggleReactionRequest } from "@/types/connect";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectChannelMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelMessages: builder.query<ConnectMessage[], { channelId: string } & GetChannelMessagesParams>({
      query: ({ channelId, ...params }) => ({ url: `/api/v1/connect/channels/${channelId}/messages`, params }),
      transformResponse: (raw: any): ConnectMessage[] => extractListFromEnvelope(raw, ["messages"]).map(normalizeConnectMessage),
      providesTags: (_r, _e, { channelId }) => [{ type: "ConnectMessages", id: channelId }],
    }),
    sendChannelMessage: builder.mutation<ConnectMessage, { channelId: string } & SendChannelMessageRequest>({
      query: ({ channelId, ...body }) => ({ url: `/api/v1/connect/channels/${channelId}/messages`, method: "POST", body }),
      transformResponse: (raw: any) => normalizeConnectMessage(raw?.data || raw),
      invalidatesTags: (_r, _e, { channelId }) => [{ type: "ConnectMessages", id: channelId }, "ConnectChannels"],
    }),
    toggleChannelReaction: builder.mutation<void, { channelId: string; messageId: string } & ToggleReactionRequest>({
      query: ({ channelId, messageId, emoji }) => ({ url: `/api/v1/connect/channels/${channelId}/messages/${messageId}/reactions`, method: "POST", body: { emoji } }),
      invalidatesTags: (_r, _e, { channelId }) => [{ type: "ConnectMessages", id: channelId }],
    }),
  }),
});
export const { useGetChannelMessagesQuery, useSendChannelMessageMutation, useToggleChannelReactionMutation } = connectChannelMessagesApi;
