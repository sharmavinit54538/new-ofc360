import { baseApi } from "./baseApi";

export interface AIModelMetadata {
  id: string;
  name: string;
  code: string;
  category: "workforce" | "talent" | "recruitment" | "compliance" | "performance" | "resource";
  description: string;
  status: "active" | "training" | "maintenance" | "inactive";
  accuracy: number;
  lastRun?: string;
  version: string;
}

export interface AIExecutionRequest {
  modelId: string;
  inputData: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface AIExecutionResponse {
  executionId: string;
  modelId: string;
  status: "queued" | "processing" | "completed" | "failed";
  result?: Record<string, unknown>;
  confidenceScore?: number;
  recommendations?: string[];
  executionTimeMs?: number;
  timestamp: string;
}

export interface AIUsageStats {
  totalExecutions: number;
  activeModelsCount: number;
  avgAccuracyPercentage: number;
  usageByCategory: Record<string, number>;
}

export type GetAiModelsArg = { category?: string } | void;

export const intelligenceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModels: builder.query<AIModelMetadata[], GetAiModelsArg>({
      query: (params) => {
        const p = params as { category?: string } | undefined;
        const cat = p?.category ? `?category=${p.category}` : "";
        return `/api/v1/intelligence/models${cat}`;
      },
      providesTags: ["AIModel", "Intelligence"],
    }),

    getAiModelById: builder.query<AIModelMetadata, string>({
      query: (id) => `/api/v1/intelligence/models/${id}`,
      providesTags: (_res, _err, id) => [{ type: "AIModel", id }],
    }),

    executeAiModel: builder.mutation<AIExecutionResponse, AIExecutionRequest>({
      query: (body) => ({
        url: `/api/v1/intelligence/models/${body.modelId}/execute`,
        method: "POST",
        body: { inputData: body.inputData, parameters: body.parameters },
      }),
      invalidatesTags: ["Intelligence"],
    }),

    getAiExecutionStatus: builder.query<AIExecutionResponse, string>({
      query: (executionId) => `/api/v1/intelligence/executions/${executionId}`,
      providesTags: (_res, _err, id) => [{ type: "Intelligence", id }],
    }),

    getAiExecutionHistory: builder.query<AIExecutionResponse[], { modelId?: string }>({
      query: (params) => {
        const query = params?.modelId ? `?modelId=${params.modelId}` : "";
        return `/api/v1/intelligence/executions/history${query}`;
      },
      providesTags: ["Intelligence"],
    }),

    getAiUsageStats: builder.query<AIUsageStats, void>({
      query: () => "/api/v1/intelligence/usage",
      providesTags: ["Intelligence"],
    }),
  }),
});

export const {
  useGetAiModelsQuery,
  useGetAiModelByIdQuery,
  useExecuteAiModelMutation,
  useGetAiExecutionStatusQuery,
  useGetAiExecutionHistoryQuery,
  useGetAiUsageStatsQuery,
} = intelligenceApi;
