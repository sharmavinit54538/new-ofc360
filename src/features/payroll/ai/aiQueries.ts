import { baseApi } from "@/services/api/baseApi";
import { APIResponse, AiPayrollInsight } from "../types";
const tag = "AiPayroll";
export const aiQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiPayrollDashboard: builder.query<APIResponse<AiPayrollInsight>, void>({ query: () => "/v1/ai/payroll/dashboard", providesTags: [{ type: tag, id: "DASHBOARD" }] }),
    getForecast: builder.query<APIResponse<AiPayrollInsight>, void>({ query: () => "/v1/ai/payroll/forecast", providesTags: [{ type: tag, id: "FORECAST" }] }),
    getAiPayrollCostAnalysis: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/cost-analysis", providesTags: [{ type: tag, id: "COST_ANALYSIS" }] }),
    getAiPayrollCostByDepartment: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/cost-by-department", providesTags: [{ type: tag, id: "COST_DEPT" }] }),
    getAiPayrollBenchmarking: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/benchmarking", providesTags: [{ type: tag, id: "BENCHMARKING" }] }),
    getAiPayrollAnomalies: builder.query<APIResponse<any[]>, void>({ query: () => "/v1/ai/payroll/anomalies", providesTags: [{ type: tag, id: "ANOMALIES" }] }),
    getAiPayrollFraudDetection: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/fraud-detection", providesTags: [{ type: tag, id: "FRAUD" }] }),
    getAiPayrollHealthScore: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/health-score", providesTags: [{ type: tag, id: "HEALTH_SCORE" }] }),
    getAiPayrollAnalytics: builder.query<APIResponse<any>, void>({ query: () => "/v1/ai/payroll/analytics", providesTags: [{ type: tag, id: "ANALYTICS" }] }),
    getAiPayrollEmployee: builder.query<APIResponse<AiPayrollInsight>, string>({ query: (id) => `/v1/ai/payroll/employee/${id}`, providesTags: (_, __, id) => [{ type: tag, id: `EMP_${id}` }] }),
  }),
});
export const { useGetAiPayrollDashboardQuery, useGetForecastQuery, useGetAiPayrollCostAnalysisQuery, useGetAiPayrollCostByDepartmentQuery, useGetAiPayrollBenchmarkingQuery, useGetAiPayrollAnomaliesQuery, useGetAiPayrollFraudDetectionQuery, useGetAiPayrollHealthScoreQuery, useGetAiPayrollAnalyticsQuery, useGetAiPayrollEmployeeQuery } = aiQueriesApi;
