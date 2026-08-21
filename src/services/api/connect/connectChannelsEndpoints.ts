import { baseApi } from "../baseApi";
import { ConnectChannel, CreateChannelRequest, UpdateChannelRequest } from "@/types/connect";
import { normalizeConnectChannel } from "./normalizeConnectChannel";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectChannelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<ConnectChannel[], void>({ query: () => "/api/v1/connect/channels", transformResponse: (r: any): ConnectChannel[] => extractListFromEnvelope(r, ["channels"]).map(normalizeConnectChannel), providesTags: ["ConnectChannels"] }),
    getChannel: builder.query<ConnectChannel, string>({ query: (id) => `/api/v1/connect/channels/${id}`, transformResponse: (r: any) => normalizeConnectChannel(r?.data || r), providesTags: (_r, _e, id) => [{ type: "ConnectChannels", id }] }),
    getChannelById: builder.query<ConnectChannel, string>({ query: (id) => `/api/v1/connect/channels/${id}`, transformResponse: (r: any) => normalizeConnectChannel(r?.data || r), providesTags: (_r, _e, id) => [{ type: "ConnectChannels", id }] }),
    createChannel: builder.mutation<ConnectChannel, CreateChannelRequest>({ query: (b) => ({ url: "/api/v1/connect/channels", method: "POST", body: b }), transformResponse: (r: any) => normalizeConnectChannel(r?.data || r), invalidatesTags: ["ConnectChannels"] }),
    updateChannel: builder.mutation<ConnectChannel, { channelId: string } & UpdateChannelRequest>({ query: ({ channelId, ...b }) => ({ url: `/api/v1/connect/channels/${channelId}`, method: "PUT", body: b }), transformResponse: (r: any) => normalizeConnectChannel(r?.data || r), invalidatesTags: (_r, _e, { channelId }) => [{ type: "ConnectChannels", id: channelId }] }),
  }),
});
export const { useGetChannelsQuery, useGetChannelQuery, useGetChannelByIdQuery, useCreateChannelMutation, useUpdateChannelMutation } = connectChannelsApi;
