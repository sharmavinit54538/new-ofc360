import { baseApi } from "../baseApi";
import { ConnectMessage, SendMessageRequest } from "@/types/connect";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectThreadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessageThread: builder.query<ConnectMessage[], string>({
      query: (messageId) => `/api/v1/connect/messages/${messageId}/thread`,
      transformResponse: (raw: any): ConnectMessage[] => extractListFromEnvelope(raw, ["messages", "thread", "replies"]).map(normalizeConnectMessage),
      providesTags: (_r, _e, id) => [{ type: "ConnectMessages", id: `thread_${id}` }],
    }),
    postThreadReply: builder.mutation<ConnectMessage, { messageId: string } & SendMessageRequest>({
      query: ({ messageId, ...body }) => ({ url: `/api/v1/connect/messages/${messageId}/thread`, method: "POST", body }),
      transformResponse: (raw: any) => normalizeConnectMessage(raw?.data || raw),
      invalidatesTags: (_r, _e, { messageId }) => [{ type: "ConnectMessages", id: `thread_${messageId}` }, "ConnectMessages"],
    }),
  }),
});
export const { useGetMessageThreadQuery, usePostThreadReplyMutation } = connectThreadsApi;
