import { api as baseApi } from "@/api/client";
import type { AIExecutionRequest } from "./intelligenceTypes";
import type { AIExecutionResponse, AIUsageStats } from "./intelligenceResponseTypes";

export const intelligenceExecutionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    executeAiModel: builder.mutation<AIExecutionResponse, AIExecutionRequest>({
      query: (body) => ({ url: `/api/v1/intelligence/models/${body.modelId}/execute`, method: "POST", body: { inputData: body.inputData, parameters: body.parameters } }),
      invalidatesTags: ["Intelligence"],
    }),
    getAiExecutionStatus: builder.query<AIExecutionResponse, string>({
      query: (id) => `/api/v1/intelligence/executions/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Intelligence", id }],
    }),
    getAiExecutionHistory: builder.query<AIExecutionResponse[], { modelId?: string }>({
      query: (params) => `/api/v1/intelligence/executions/history${params?.modelId ? `?modelId=${params.modelId}` : ""}`,
      providesTags: ["Intelligence"],
    }),
    getAiUsageStats: builder.query<AIUsageStats, void>({
      query: () => "/api/v1/intelligence/usage",
      providesTags: ["Intelligence"],
    }),
  }),
});
export const { useExecuteAiModelMutation, useGetAiExecutionStatusQuery, useGetAiExecutionHistoryQuery, useGetAiUsageStatsQuery } = intelligenceExecutionsApi;
