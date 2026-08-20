import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayCycle, PaginationQueryParams } from "../types";
export const payCyclesQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayCycles: builder.query<APIResponse<PayCycle[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/cycles", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "PayCycle" as const, id })), { type: "PayCycle", id: "LIST" }] : [{ type: "PayCycle", id: "LIST" }] }),
    getPayCycleLogs: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/cycles/logs", providesTags: [{ type: "PayCycle", id: "LOGS" }] }),
    getPayCycleHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/cycles/history", providesTags: [{ type: "PayCycle", id: "HISTORY" }] }),
    getPayCycleById: builder.query<APIResponse<PayCycle>, string>({ query: (id) => `/v2/payroll/cycles/${id}`, providesTags: (_, __, id) => [{ type: "PayCycle", id }] }),
  }),
});
export const { useGetPayCyclesQuery, useGetPayCycleLogsQuery, useGetPayCycleHistoryQuery, useGetPayCycleByIdQuery } = payCyclesQueriesApi;
