import { baseApi } from "../baseApi";
import { ConnectMessage, ConnectUser, SendMeetingMessageRequest } from "@/types/connect";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
import { normalizeConnectUser } from "./normalizeConnectUser";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectMeetingMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetingMessages: builder.query<ConnectMessage[], string>({
      query: (id) => `/api/v1/connect/meetings/${id}/messages`,
      transformResponse: (raw: any): ConnectMessage[] => extractListFromEnvelope(raw, ["messages"]).map((m) => normalizeConnectMessage(m)),
    }),
    sendMeetingMessage: builder.mutation<ConnectMessage, { meetingId: string } & SendMeetingMessageRequest>({
      query: ({ meetingId, ...body }) => ({ url: `/api/v1/connect/meetings/${meetingId}/messages`, method: "POST", body }),
    }),
    getMeetingParticipants: builder.query<ConnectUser[], string>({
      query: (id) => `/api/v1/connect/meetings/${id}/participants`,
      transformResponse: (raw: any): ConnectUser[] => extractListFromEnvelope(raw, ["participants", "users"]).map((u) => normalizeConnectUser(u)),
    }),
  }),
});
export const { useGetMeetingMessagesQuery, useSendMeetingMessageMutation, useGetMeetingParticipantsQuery } = connectMeetingMessagesApi;
