import { baseApi } from "../baseApi";
import { ConnectConversation, CreateConversationRequest } from "@/types/connect";
import { normalizeConnectConversation } from "./normalizeConnectConversation";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectConversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ConnectConversation[], void>({
      query: () => "/api/v1/connect/conversations",
      transformResponse: (r: any): ConnectConversation[] => extractListFromEnvelope(r, ["conversations"]).map(normalizeConnectConversation),
      providesTags: ["ConnectConversations"],
    }),
    getConversationById: builder.query<ConnectConversation, string>({
      query: (id) => `/api/v1/connect/conversations/${id}`,
      transformResponse: (r: any) => normalizeConnectConversation(r?.data || r),
      providesTags: (_r, _e, id) => [{ type: "ConnectConversations", id }],
    }),
    createConversation: builder.mutation<ConnectConversation, CreateConversationRequest>({
      query: (body) => ({ url: "/api/v1/connect/conversations", method: "POST", body }),
      transformResponse: (r: any) => normalizeConnectConversation(r?.data || r),
      invalidatesTags: ["ConnectConversations"],
    }),
    pinConversation: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/conversations/${id}/pin`, method: "PUT" }), invalidatesTags: ["ConnectConversations"] }),
    muteConversation: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/conversations/${id}/mute`, method: "PUT" }), invalidatesTags: ["ConnectConversations"] }),
    markConversationRead: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/conversations/${id}/read`, method: "PUT" }), invalidatesTags: ["ConnectConversations"] }),
  }),
});
export const {
  useGetConversationsQuery, useGetConversationByIdQuery, useCreateConversationMutation,
  usePinConversationMutation, useMuteConversationMutation, useMarkConversationReadMutation,
} = connectConversationsApi;
