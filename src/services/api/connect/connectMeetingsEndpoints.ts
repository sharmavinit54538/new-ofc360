import { baseApi } from "../baseApi";
import { ConnectMeeting, CreateMeetingRequest, JoinMeetingRequest } from "@/types/connect";
import { normalizeConnectMeeting } from "./normalizeConnectMedia";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectMeetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<ConnectMeeting[], void>({ query: () => "/api/v1/connect/meetings", transformResponse: (r: any): ConnectMeeting[] => extractListFromEnvelope(r, ["meetings"]).map(normalizeConnectMeeting), providesTags: ["ConnectMeetings"] }),
    getMeeting: builder.query<ConnectMeeting, string>({ query: (id) => `/api/v1/connect/meetings/${id}`, transformResponse: (r: any) => normalizeConnectMeeting(r?.data || r), providesTags: (_r, _e, id) => [{ type: "ConnectMeetings", id }] }),
    getMeetingById: builder.query<ConnectMeeting, string>({ query: (id) => `/api/v1/connect/meetings/${id}`, transformResponse: (r: any) => normalizeConnectMeeting(r?.data || r), providesTags: (_r, _e, id) => [{ type: "ConnectMeetings", id }] }),
    createMeeting: builder.mutation<ConnectMeeting, CreateMeetingRequest>({ query: (b) => ({ url: "/api/v1/connect/meetings", method: "POST", body: b }), transformResponse: (r: any) => normalizeConnectMeeting(r?.data || r), invalidatesTags: ["ConnectMeetings"] }),
    joinMeeting: builder.mutation<{ token: string; meeting: ConnectMeeting }, { meetingId: string } & JoinMeetingRequest>({ query: ({ meetingId, ...b }) => ({ url: `/api/v1/connect/meetings/${meetingId}/join`, method: "POST", body: b }) }),
    leaveMeeting: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/meetings/${id}/leave`, method: "POST" }) }),
    endMeeting: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/meetings/${id}/end`, method: "POST" }), invalidatesTags: ["ConnectMeetings"] }),
  }),
});
export const {
  useGetMeetingsQuery, useGetMeetingQuery, useGetMeetingByIdQuery,
  useCreateMeetingMutation, useJoinMeetingMutation, useLeaveMeetingMutation, useEndMeetingMutation,
} = connectMeetingsApi;
