import { baseApi } from "../baseApi";
import { ChannelMember, AddChannelMembersRequest } from "@/types/connect";
import { normalizeChannelMember } from "./normalizeChannelMember";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectChannelMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelMembers: builder.query<ChannelMember[], string>({
      query: (id) => `/api/v1/connect/channels/${id}/members`,
      transformResponse: (raw: any): ChannelMember[] => extractListFromEnvelope(raw, ["members"]).map(normalizeChannelMember),
    }),
    addChannelMembers: builder.mutation<void, { channelId: string } & AddChannelMembersRequest>({
      query: ({ channelId, userIds }) => ({ url: `/api/v1/connect/channels/${channelId}/members`, method: "POST", body: { userIds } }),
      invalidatesTags: (_r, _e, { channelId }) => [{ type: "ConnectChannels", id: channelId }],
    }),
    removeChannelMember: builder.mutation<void, { channelId: string; userId: string }>({
      query: ({ channelId, userId }) => ({ url: `/api/v1/connect/channels/${channelId}/members/${userId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { channelId }) => [{ type: "ConnectChannels", id: channelId }],
    }),
  }),
});
export const { useGetChannelMembersQuery, useAddChannelMembersMutation, useRemoveChannelMemberMutation } = connectChannelMembersApi;
