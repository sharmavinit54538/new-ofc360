import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollTemplate, PaginationQueryParams } from "./types";
export const templatesQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollTemplates: builder.query<APIResponse<PayrollTemplate[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/templates", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Template" as const, id })), { type: "Template", id: "LIST" }] : [{ type: "Template", id: "LIST" }] }),
    getPayrollTemplatesAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/templates/audit", providesTags: [{ type: "Template", id: "AUDIT" }] }),
    getPayrollTemplatesHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/templates/history", providesTags: [{ type: "Template", id: "HISTORY" }] }),
    getPayrollTemplateById: builder.query<APIResponse<PayrollTemplate>, string>({ query: (id) => `/v2/payroll/templates/${id}`, providesTags: (_, __, id) => [{ type: "Template", id }] }),
  }),
});
export const { useGetPayrollTemplatesQuery, useGetPayrollTemplatesAuditQuery, useGetPayrollTemplatesHistoryQuery, useGetPayrollTemplateByIdQuery } = templatesQueriesApi;
