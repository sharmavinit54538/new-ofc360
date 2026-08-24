import { baseApi } from "../baseApi";
import { CallHistoryItem, IceServersResponse, InitiateCallRequest, UpdateCallStatusRequest, CallSignalPayload } from "@/types/connect";
import { normalizeCallHistoryItem } from "./normalizeConnectMedia";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectCallsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateCall: builder.mutation<{ callId: string; status: string }, InitiateCallRequest>({
      query: (b) => ({
        url: "/api/v1/connect/calls/initiate",
        method: "POST",
        body: b,
      }),
      transformResponse: (r: any): { callId: string; status: string } => {
        const payload = r?.data || r;
        return {
          callId: String(payload?.callId || payload?.id || payload?.call_id || ""),
          status: String(payload?.status || "calling"),
        };
      },
    }),
    updateCallStatus: builder.mutation<void, { callId: string } & UpdateCallStatusRequest>({
      query: ({ callId, ...b }) => ({
        url: `/api/v1/connect/calls/${callId}/status`,
        method: "PATCH",
        body: {
          status: b.status,
          duration: b.duration ?? b.durationSeconds,
        },
      }),
      invalidatesTags: ["ConnectCalls"],
    }),
    sendCallSignal: builder.mutation<void, { callId: string } & CallSignalPayload>({
      query: ({ callId, ...b }) => ({
        url: `/api/v1/connect/calls/${callId}/signal`,
        method: "POST",
        body: b,
      }),
    }),
    getCallHistory: builder.query<CallHistoryItem[], void>({
      query: () => "/api/v1/connect/calls/history",
      transformResponse: (r: any): CallHistoryItem[] => {
        const rawList = extractListFromEnvelope(r, ["calls", "history", "logs", "items", "data"]);
        if (!Array.isArray(rawList)) return [];
        return rawList.map(normalizeCallHistoryItem);
      },
      providesTags: ["ConnectCalls"],
    }),
    getIceServers: builder.query<IceServersResponse, void>({
      query: () => "/api/v1/connect/calls/ice-servers",
      transformResponse: (r: any): IceServersResponse => {
        if (r?.iceServers && Array.isArray(r.iceServers)) return r;
        if (r?.data?.iceServers && Array.isArray(r.data.iceServers)) return r.data;
        if (Array.isArray(r?.data)) return { iceServers: r.data };
        if (Array.isArray(r)) return { iceServers: r };
        return {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        };
      },
    }),
  }),
});

export const {
  useInitiateCallMutation,
  useUpdateCallStatusMutation,
  useSendCallSignalMutation,
  useGetCallHistoryQuery,
  useGetCallHistoryQuery: useGetCallLogsQuery,
  useGetIceServersQuery,
} = connectCallsApi;

