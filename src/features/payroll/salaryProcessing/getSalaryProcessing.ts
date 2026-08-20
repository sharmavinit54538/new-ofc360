import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryProcessingRun } from "../types";
export const getSalaryProcessingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryProcessing: builder.query<APIResponse<SalaryProcessingRun>, void>({ query: () => "/v2/payroll/salary-processing", providesTags: [{ type: "SalaryProcessing", id: "LIST" }] }),
    getSalaryProcessingHero: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/hero", providesTags: [{ type: "SalaryProcessing", id: "HERO" }] }),
    getSalaryProcessingKpis: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/kpis", providesTags: [{ type: "SalaryProcessing", id: "KPIS" }] }),
    getSalaryProcessingApprovalWorkflow: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/approval-workflow", providesTags: [{ type: "SalaryProcessing", id: "WORKFLOW" }] }),
    getSalaryProcessingAiInsights: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/ai-insights", providesTags: [{ type: "SalaryProcessing", id: "INSIGHTS" }] }),
    getSalaryProcessingValidations: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/validations", providesTags: [{ type: "SalaryProcessing", id: "VALIDATIONS" }] }),
    getSalaryProcessingAnalytics: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-processing/analytics", providesTags: [{ type: "SalaryProcessing", id: "ANALYTICS" }] }),
  }),
});
export const {
  useGetSalaryProcessingQuery, useGetSalaryProcessingHeroQuery, useGetSalaryProcessingKpisQuery,
  useGetSalaryProcessingApprovalWorkflowQuery, useGetSalaryProcessingAiInsightsQuery,
  useGetSalaryProcessingValidationsQuery, useGetSalaryProcessingAnalyticsQuery,
} = getSalaryProcessingApi;
