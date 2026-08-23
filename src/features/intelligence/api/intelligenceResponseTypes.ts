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
