import { baseApi } from "@/services/api/baseApi";
import { APIResponse, AiPayrollInsight } from "./types";

export const aiPayrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiPayrollDashboard: builder.query<APIResponse<AiPayrollInsight>, void>({
      query: () => ({
        url: "/v1/ai/payroll/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "DASHBOARD" }],
    }),

    getForecast: builder.query<APIResponse<AiPayrollInsight>, void>({
      query: () => ({
        url: "/v1/ai/payroll/forecast",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "FORECAST" }],
    }),

    getAiPayrollCostAnalysis: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/cost-analysis",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "COST_ANALYSIS" }],
    }),

    getAiPayrollCostByDepartment: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/cost-by-department",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "COST_DEPT" }],
    }),

    getAiPayrollBenchmarking: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/benchmarking",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "BENCHMARKING" }],
    }),

    getAiPayrollAnomalies: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v1/ai/payroll/anomalies",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "ANOMALIES" }],
    }),

    getAiPayrollFraudDetection: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/fraud-detection",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "FRAUD" }],
    }),

    getAiPayrollHealthScore: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/health-score",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "HEALTH_SCORE" }],
    }),

    getAiPayrollAnalytics: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v1/ai/payroll/analytics",
        method: "GET",
      }),
      providesTags: [{ type: "AiPayroll", id: "ANALYTICS" }],
    }),

    getAiPayrollEmployee: builder.query<APIResponse<AiPayrollInsight>, string>({
      query: (employeeId) => ({
        url: `/v1/ai/payroll/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, employeeId) => [{ type: "AiPayroll", id: `EMP_${employeeId}` }],
    }),

    generateForecast: builder.mutation<APIResponse<AiPayrollInsight>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v1/ai/payroll/forecast",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "AiPayroll", id: "FORECAST" }],
    }),

    analyzeAiPayroll: builder.mutation<APIResponse<Record<string, any>>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v1/ai/payroll/analyze",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "AiPayroll", id: "DASHBOARD" }],
    }),

    detectAiPayrollAnomalies: builder.mutation<APIResponse<any[]>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v1/ai/payroll/detect-anomalies",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "AiPayroll", id: "ANOMALIES" }],
    }),

    detectAiPayrollFraud: builder.mutation<APIResponse<Record<string, any>>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v1/ai/payroll/detect-fraud",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "AiPayroll", id: "FRAUD" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiPayrollDashboardQuery,
  useGetForecastQuery,
  useGetAiPayrollCostAnalysisQuery,
  useGetAiPayrollCostByDepartmentQuery,
  useGetAiPayrollBenchmarkingQuery,
  useGetAiPayrollAnomaliesQuery,
  useGetAiPayrollFraudDetectionQuery,
  useGetAiPayrollHealthScoreQuery,
  useGetAiPayrollAnalyticsQuery,
  useGetAiPayrollEmployeeQuery,
  useGenerateForecastMutation,
  useAnalyzeAiPayrollMutation,
  useDetectAiPayrollAnomaliesMutation,
  useDetectAiPayrollFraudMutation,
} = aiPayrollApi;