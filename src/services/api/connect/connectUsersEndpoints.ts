import { baseApi } from "../baseApi";
import { ConnectUser, GetColleaguesParams, ColleaguesResponse, UpdatePresenceRequest, BatchPresenceRequest, BatchPresenceResponse } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ConnectUser, void>({ query: () => "/api/v1/connect/users/me", transformResponse: (r: any) => normalizeConnectUser(r?.data || r), providesTags: ["ConnectUser"] }),
    getColleagues: builder.query<ColleaguesResponse, GetColleaguesParams | void>({ query: (p) => ({ url: "/api/v1/connect/users/colleagues", params: p || undefined }), transformResponse: (r: any): ColleaguesResponse => ({ colleagues: extractListFromEnvelope(r, ["colleagues", "users"]).map(normalizeConnectUser), total: r?.total || 0, page: r?.page || 1, limit: r?.limit || 20 }), providesTags: ["ConnectColleagues"] }),
    getUserPresence: builder.query<{ presence: string }, string>({ query: (id) => `/api/v1/connect/users/${id}/presence` }),
    batchPresence: builder.mutation<BatchPresenceResponse, BatchPresenceRequest>({ query: (b) => ({ url: "/api/v1/connect/users/presence/batch", method: "POST", body: b }) }),
    getBatchPresence: builder.mutation<BatchPresenceResponse, BatchPresenceRequest>({ query: (b) => ({ url: "/api/v1/connect/users/presence/batch", method: "POST", body: b }) }),
    updatePresence: builder.mutation<void, UpdatePresenceRequest>({ query: (b) => ({ url: "/api/v1/connect/users/presence", method: "PUT", body: b }), invalidatesTags: ["ConnectUser"] }),
  }),
});
export const {
  useGetMeQuery, useGetColleaguesQuery, useGetUserPresenceQuery, useBatchPresenceMutation,
  useGetBatchPresenceMutation, useUpdatePresenceMutation, useUpdatePresenceMutation: useUpdateMyPresenceMutation,
} = connectUsersApi;
