import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryComponent, PaginationQueryParams } from "./types";
export const componentsQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryComponents: builder.query<APIResponse<SalaryComponent[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/components", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "SalaryComponent" as const, id })), { type: "SalaryComponent", id: "LIST" }] : [{ type: "SalaryComponent", id: "LIST" }] }),
    getSalaryComponentsAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/components/audit", providesTags: [{ type: "SalaryComponent", id: "AUDIT" }] }),
    getSalaryComponentsHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/components/history", providesTags: [{ type: "SalaryComponent", id: "HISTORY" }] }),
    getSalaryComponentById: builder.query<APIResponse<SalaryComponent>, string>({ query: (id) => `/v2/payroll/components/${id}`, providesTags: (_, __, id) => [{ type: "SalaryComponent", id }] }),
  }),
});
export const { useGetSalaryComponentsQuery, useGetSalaryComponentsAuditQuery, useGetSalaryComponentsHistoryQuery, useGetSalaryComponentByIdQuery } = componentsQueriesApi;
