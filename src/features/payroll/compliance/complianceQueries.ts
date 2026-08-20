import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ComplianceRule, PaginationQueryParams } from "../types";
export const complianceQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceConfig: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/compliance/config", providesTags: [{ type: "Compliance", id: "CONFIG" }] }),
    getComplianceDashboard: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/compliance/dashboard", providesTags: [{ type: "Compliance", id: "DASHBOARD" }] }),
    getComplianceRules: builder.query<APIResponse<ComplianceRule[]>, PaginationQueryParams | void>({
      query: (p) => ({ url: "/v2/payroll/compliance/rules", params: p || undefined }),
      providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Compliance" as const, id })), { type: "Compliance", id: "LIST" }] : [{ type: "Compliance", id: "LIST" }] }),
    getComplianceAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/compliance/audit", providesTags: [{ type: "Compliance", id: "AUDIT" }] }),
    getComplianceHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/compliance/history", providesTags: [{ type: "Compliance", id: "HISTORY" }] }),
    getComplianceCalendar: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/compliance/calendar", providesTags: [{ type: "Compliance", id: "CALENDAR" }] }),
    getComplianceRuleById: builder.query<APIResponse<ComplianceRule>, string>({ query: (id) => `/v2/payroll/compliance/${id}`, providesTags: (_, __, id) => [{ type: "Compliance", id }] }),
  }),
});
export const { useGetComplianceConfigQuery, useGetComplianceDashboardQuery, useGetComplianceRulesQuery, useGetComplianceAuditQuery, useGetComplianceHistoryQuery, useGetComplianceCalendarQuery, useGetComplianceRuleByIdQuery } = complianceQueriesApi;
