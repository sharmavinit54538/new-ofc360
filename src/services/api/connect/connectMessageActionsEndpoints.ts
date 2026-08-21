import { baseApi } from "../baseApi";
import { ToggleReactionRequest } from "@/types/connect";

export const connectMessageActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteMessage: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/messages/${id}`, method: "DELETE" }), invalidatesTags: ["ConnectMessages", "ConnectConversations"] }),
    toggleReaction: builder.mutation<void, { messageId: string } & ToggleReactionRequest>({
      query: ({ messageId, emoji }) => ({ url: `/api/v1/connect/messages/${messageId}/reactions`, method: "POST", body: { emoji } }),
      invalidatesTags: ["ConnectMessages"],
    }),
    pinMessage: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/messages/${id}/pin`, method: "PUT" }), invalidatesTags: ["ConnectMessages"] }),
  }),
});
export const { useDeleteMessageMutation, useToggleReactionMutation, usePinMessageMutation } = connectMessageActionsApi;
