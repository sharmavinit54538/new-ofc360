import { baseApi } from "../baseApi";

export const connectChannelActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteChannel: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/channels/${id}`, method: "DELETE" }), invalidatesTags: ["ConnectChannels"] }),
    archiveChannel: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/channels/${id}/archive`, method: "PUT" }), invalidatesTags: ["ConnectChannels"] }),
    leaveChannel: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/channels/${id}/leave`, method: "POST" }), invalidatesTags: ["ConnectChannels"] }),
  }),
});
export const { useDeleteChannelMutation, useArchiveChannelMutation, useLeaveChannelMutation } = connectChannelActionsApi;
