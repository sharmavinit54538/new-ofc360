import { baseApi } from "../baseApi";
import { CallHistoryItem, IceServersResponse, InitiateCallRequest, UpdateCallStatusRequest, CallSignalPayload } from "@/types/connect";
import { normalizeCallHistoryItem } from "./normalizeConnectMedia";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectCallsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateCall: builder.mutation<{ callId: string; status: string }, InitiateCallRequest>({ query: (b) => ({ url: "/api/v1/connect/calls", method: "POST", body: b }) }),
    updateCallStatus: builder.mutation<void, { callId: string } & UpdateCallStatusRequest>({ query: ({ callId, ...b }) => ({ url: `/api/v1/connect/calls/${callId}/status`, method: "PUT", body: b }) }),
    sendCallSignal: builder.mutation<void, { callId: string } & CallSignalPayload>({ query: ({ callId, ...b }) => ({ url: `/api/v1/connect/calls/${callId}/signal`, method: "POST", body: b }) }),
    getCallHistory: builder.query<CallHistoryItem[], void>({
      query: () => "/api/v1/connect/calls/history",
      transformResponse: (r: any): CallHistoryItem[] => extractListFromEnvelope(r, ["calls", "history"]).map(normalizeCallHistoryItem),
      providesTags: ["ConnectCalls"],
    }),
    getIceServers: builder.query<IceServersResponse, void>({ query: () => "/api/v1/connect/calls/ice-servers" }),
  }),
});
export const {
  useInitiateCallMutation, useUpdateCallStatusMutation, useSendCallSignalMutation,
  useGetCallHistoryQuery, useGetCallHistoryQuery: useGetCallLogsQuery, useGetIceServersQuery,
} = connectCallsApi;
