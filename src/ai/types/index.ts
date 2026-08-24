export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface AIChatRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

export interface AIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: AIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AICompletionRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
}

export interface AICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIEmbeddingRequest {
  input: string | string[];
  model?: string;
  encoding_format?: 'float' | 'base64';
}

export interface AIEmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface AIAnalyzeRequest {
  input: string;
  task: 'sentiment' | 'classification' | 'extraction' | 'summarization' | 'translation' | 'custom';
  parameters?: Record<string, unknown>;
  model?: string;
}

export interface AIAnalyzeResponse {
  result: unknown;
  confidence?: number;
  model: string;
  latencyMs: number;
}

export interface AIGenerateRequest {
  prompt: string;
  task: 'text' | 'code' | 'document' | 'email' | 'questions' | 'summary' | 'custom';
  parameters?: Record<string, unknown>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIGenerateResponse {
  content: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
}

export interface AIMatchRequest {
  source: string;
  target: string;
  type: 'resume-job' | 'candidate-candidate' | 'skill-job' | 'custom';
  model?: string;
}

export interface AIMatchResponse {
  score: number;
  breakdown?: Record<string, number>;
  explanation?: string;
  model: string;
  latencyMs: number;
}

export interface AIRankRequest {
  items: Array<{ id: string; content: string }>;
  query: string;
  model?: string;
  topK?: number;
}

export interface AIRankResponse {
  results: Array<{ id: string; rank: number; score: number }>;
  model: string;
  latencyMs: number;
}

export interface AIModelMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  supportsStreaming: boolean;
  supportsFunctions: boolean;
  pricing?: {
    input: number;
    output: number;
    unit: string;
  };
}

export interface AIExecutionRequest {
  modelId: string;
  inputData: unknown;
  parameters?: Record<string, unknown>;
}

export interface AIExecutionResponse {
  id: string;
  modelId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputData: unknown;
  outputData?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
  latencyMs?: number;
  tokensUsed?: number;
}

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byModel: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
  byFeature: Record<string, {
    requests: number;
    tokens: number;
  }>;
}

export interface AIError {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
}

export type AITaskType =
  | 'chat'
  | 'complete'
  | 'embed'
  | 'analyze'
  | 'generate'
  | 'match'
  | 'rank'
  | 'extract'
  | 'summarize'
  | 'translate'
  | 'classify';

export interface AIServiceOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onStream?: (chunk: string) => void;
  signal?: AbortSignal;
}

export type AIProvider = 'openai' | 'gemini' | 'ollama' | 'anthropic' | 'backend' | 'local';

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  baseUrl?: string;
  apiKey?: string;
}