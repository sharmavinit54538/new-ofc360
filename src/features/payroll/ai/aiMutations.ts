import { baseApi } from "@/services/api/baseApi";
import { APIResponse, AiPayrollInsight } from "../types";
const tag = "AiPayroll";
export const aiMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateForecast: builder.mutation<APIResponse<AiPayrollInsight>, any>({ query: (body) => ({ url: "/v1/ai/payroll/forecast", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "FORECAST" }] }),
    analyzeAiPayroll: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v1/ai/payroll/analyze", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "DASHBOARD" }] }),
    detectAiPayrollAnomalies: builder.mutation<APIResponse<any[]>, any>({ query: (body) => ({ url: "/v1/ai/payroll/detect-anomalies", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "ANOMALIES" }] }),
    detectAiPayrollFraud: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v1/ai/payroll/detect-fraud", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "FRAUD" }] }),
  }),
});
export const { useGenerateForecastMutation, useAnalyzeAiPayrollMutation, useDetectAiPayrollAnomaliesMutation, useDetectAiPayrollFraudMutation } = aiMutationsApi;
