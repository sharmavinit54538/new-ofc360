export interface AIExecutionOptions {
  stream?: boolean;
  contextHistory?: { role: "user" | "assistant"; content: string }[];
  visionImageDataUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIExecutionResponse {
  modelId: string;
  modelTitle: string;
  category: string;
  provider: string;
  latencyMs: number;
  tokensUsed: number;
  response: string;
  embeddingVector?: number[];
  isStreamed: boolean;
}
