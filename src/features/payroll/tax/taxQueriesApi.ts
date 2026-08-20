import { baseApi } from "@/services/api/baseApi";
import { APIResponse, TaxSetting, PaginationQueryParams } from "../types";
export const taxQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTax: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/admin/tax", providesTags: [{ type: "Tax", id: "ADMIN_TAX" }] }),
    getTaxes: builder.query<APIResponse<TaxSetting[]>, PaginationQueryParams | void>({
      query: (p) => ({ url: "/v2/payroll/taxes", params: p || undefined }),
      providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Tax" as const, id })), { type: "Tax", id: "LIST" }] : [{ type: "Tax", id: "LIST" }],
    }),
    getTaxById: builder.query<APIResponse<TaxSetting>, string>({ query: (id) => `/v2/payroll/taxes/${id}`, providesTags: (_, __, id) => [{ type: "Tax", id }] }),
    getTaxesAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/taxes/audit", providesTags: [{ type: "Tax", id: "AUDIT" }] }),
    getTaxesHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/taxes/history", providesTags: [{ type: "Tax", id: "HISTORY" }] }),
    exportTaxes: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/taxes/export" }),
  }),
});
export const { useGetAdminTaxQuery, useGetTaxesQuery, useGetTaxByIdQuery, useGetTaxesAuditQuery, useGetTaxesHistoryQuery, useExportTaxesQuery } = taxQueriesApi;
