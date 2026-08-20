import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Allowance, PaginationQueryParams } from "./types";
export const allowancesQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllowances: builder.query<APIResponse<Allowance[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/allowances", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Allowance" as const, id })), { type: "Allowance", id: "LIST" }] : [{ type: "Allowance", id: "LIST" }] }),
    getAllowancesAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/allowances/audit", providesTags: [{ type: "Allowance", id: "AUDIT" }] }),
    getAllowancesHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/allowances/history", providesTags: [{ type: "Allowance", id: "HISTORY" }] }),
    exportAllowances: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/allowances/export" }),
    getAllowanceById: builder.query<APIResponse<Allowance>, string>({ query: (id) => `/v2/payroll/allowances/${id}`, providesTags: (_, __, id) => [{ type: "Allowance", id }] }),
  }),
});
export const { useGetAllowancesQuery, useGetAllowancesAuditQuery, useGetAllowancesHistoryQuery, useExportAllowancesQuery, useGetAllowanceByIdQuery } = allowancesQueriesApi;
