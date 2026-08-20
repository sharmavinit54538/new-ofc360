import { baseApi } from "@/services/api/baseApi";
import { APIResponse, OvertimeEntry, PaginationQueryParams } from "../types";
export const overtimeQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOvertimeEntries: builder.query<APIResponse<OvertimeEntry[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/overtime", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Overtime" as const, id })), { type: "Overtime", id: "LIST" }] : [{ type: "Overtime", id: "LIST" }] }),
    getOvertimeSettings: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/overtime/settings", providesTags: [{ type: "Overtime", id: "SETTINGS" }] }),
    getOvertimeHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/overtime/history", providesTags: [{ type: "Overtime", id: "HISTORY" }] }),
    getOvertimeAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/overtime/audit", providesTags: [{ type: "Overtime", id: "AUDIT" }] }),
  }),
});
export const { useGetOvertimeEntriesQuery, useGetOvertimeSettingsQuery, useGetOvertimeHistoryQuery, useGetOvertimeAuditQuery } = overtimeQueriesApi;
