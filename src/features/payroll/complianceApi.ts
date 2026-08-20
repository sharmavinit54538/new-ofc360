import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ComplianceRule, PaginationQueryParams } from "./types";

export const complianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceConfig: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/compliance/config",
        method: "GET",
      }),
      providesTags: [{ type: "Compliance", id: "CONFIG" }],
    }),

    getComplianceDashboard: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/compliance/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "Compliance", id: "DASHBOARD" }],
    }),

    getComplianceRules: builder.query<APIResponse<ComplianceRule[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/compliance/rules",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Compliance" as const, id })),
              { type: "Compliance", id: "LIST" },
            ]
          : [{ type: "Compliance", id: "LIST" }],
    }),

    getComplianceAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/compliance/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Compliance", id: "AUDIT" }],
    }),

    getComplianceHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/compliance/history",
        method: "GET",
      }),
      providesTags: [{ type: "Compliance", id: "HISTORY" }],
    }),

    getComplianceCalendar: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/compliance/calendar",
        method: "GET",
      }),
      providesTags: [{ type: "Compliance", id: "CALENDAR" }],
    }),

    getComplianceRuleById: builder.query<APIResponse<ComplianceRule>, string>({
      query: (ruleId) => ({
        url: `/v2/payroll/compliance/${ruleId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, ruleId) => [{ type: "Compliance", id: ruleId }],
    }),

    validateCompliance: builder.mutation<APIResponse<Record<string, any>>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/compliance/validate",
        method: "POST",
        body: body || {},
      }),
    }),

    generateComplianceChallan: builder.mutation<APIResponse<Record<string, any>>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/compliance/challan",
        method: "POST",
        body,
      }),
    }),

    createComplianceRule: builder.mutation<APIResponse<ComplianceRule>, Partial<ComplianceRule>>({
      query: (body) => ({
        url: "/v2/payroll/compliance",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Compliance", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComplianceConfigQuery,
  useGetComplianceDashboardQuery,
  useGetComplianceRulesQuery,
  useGetComplianceAuditQuery,
  useGetComplianceHistoryQuery,
  useGetComplianceCalendarQuery,
  useGetComplianceRuleByIdQuery,
  useValidateComplianceMutation,
  useGenerateComplianceChallanMutation,
  useCreateComplianceRuleMutation,
} = complianceApi;