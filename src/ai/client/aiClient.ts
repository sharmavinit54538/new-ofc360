import { baseApi } from '@/api/client';
import type {
  AIChatRequest,
  AIChatResponse,
  AICompletionRequest,
  AICompletionResponse,
  AIEmbeddingRequest,
  AIEmbeddingResponse,
  AIAnalyzeRequest,
  AIAnalyzeResponse,
  AIGenerateRequest,
  AIGenerateResponse,
  AIMatchRequest,
  AIMatchResponse,
  AIRankRequest,
  AIRankResponse,
  AIModelMetadata,
  AIExecutionRequest,
  AIExecutionResponse,
  AIUsageStats,
  AIError,
  AIServiceOptions,
} from '../types';

class AIClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: AIError = {
        code: `HTTP_${response.status}`,
        message: errorData.message || `Request failed with status ${response.status}`,
        details: errorData,
        retryable: response.status >= 500 || response.status === 429,
      };
      throw error;
    }

    return response.json();
  }

  async chat(request: AIChatRequest, options?: AIServiceOptions): Promise<AIChatResponse> {
    return this.request<AIChatResponse>(`/api/v1/ai/chat`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async complete(request: AICompletionRequest, options?: AIServiceOptions): Promise<AICompletionResponse> {
    return this.request<AICompletionResponse>(`/api/v1/ai/complete`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async embed(request: AIEmbeddingRequest, options?: AIServiceOptions): Promise<AIEmbeddingResponse> {
    return this.request<AIEmbeddingResponse>(`/api/v1/ai/embedding`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async analyze(request: AIAnalyzeRequest, options?: AIServiceOptions): Promise<AIAnalyzeResponse> {
    return this.request<AIAnalyzeResponse>(`/api/v1/ai/analyze`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async generate(request: AIGenerateRequest, options?: AIServiceOptions): Promise<AIGenerateResponse> {
    return this.request<AIGenerateResponse>(`/api/v1/ai/generate`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async match(request: AIMatchRequest, options?: AIServiceOptions): Promise<AIMatchResponse> {
    return this.request<AIMatchResponse>(`/api/v1/ai/match`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async rank(request: AIRankRequest, options?: AIServiceOptions): Promise<AIRankResponse> {
    return this.request<AIRankResponse>(`/api/v1/ai/rank`, {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    });
  }

  async getModels(): Promise<AIModelMetadata[]> {
    return this.request<AIModelMetadata[]>(`/api/v1/intelligence/models`);
  }

  async getModelById(id: string): Promise<AIModelMetadata> {
    return this.request<AIModelMetadata>(`/api/v1/intelligence/models/${id}`);
  }

  async executeModel(request: AIExecutionRequest, options?: AIServiceOptions): Promise<AIExecutionResponse> {
    const targetId = request.capabilityId || request.modelId || 'ofc360-ai';
    return this.request<AIExecutionResponse>(`/api/v1/intelligence/models/${targetId}/execute`, {
      method: 'POST',
      body: JSON.stringify({
        inputData: request.inputData,
        parameters: request.parameters,
      }),
      signal: options?.signal,
    });
  }

  async executeCapability(capabilityId: string, inputData: unknown, parameters?: Record<string, unknown>, options?: AIServiceOptions): Promise<AIExecutionResponse> {
    return this.executeModel({ capabilityId, inputData, parameters }, options);
  }

  async getExecutionStatus(id: string): Promise<AIExecutionResponse> {
    return this.request<AIExecutionResponse>(`/api/v1/intelligence/executions/${id}`);
  }

  async getExecutionHistory(modelId?: string): Promise<AIExecutionResponse[]> {
    const params = modelId ? `?modelId=${modelId}` : '';
    return this.request<AIExecutionResponse[]>(`/api/v1/intelligence/executions/history${params}`);
  }

  async getUsageStats(): Promise<AIUsageStats> {
    return this.request<AIUsageStats>(`/api/v1/intelligence/usage`);
  }

  async detectMood(text: string): Promise<{ mood: string; confidence: number }> {
    return this.request<{ mood: string; confidence: number }>(`/api/v2/mood/detect`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async assessRisk(data: Record<string, unknown>): Promise<{ riskScore: number; factors: string[] }> {
    return this.request<{ riskScore: number; factors: string[] }>(`/api/v2/risk/assess`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateEmail(data: Record<string, unknown>): Promise<{ content: string }> {
    return this.request<{ content: string }>(`/api/v2/emails/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createEmotionSession(data: Record<string, unknown>): Promise<{ sessionId: string }> {
    return this.request<{ sessionId: string }>(`/api/v2/emotions/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendEmotionMessage(sessionId: string, message: string): Promise<{ response: string }> {
    return this.request<{ response: string }>(`/api/v2/emotions/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async copilotQuery(query: string, context?: Record<string, unknown>): Promise<{ answer: string }> {
    return this.request<{ answer: string }>(`/api/v2/copilot/query`, {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }
}

export const aiClient = new AIClient();
export default aiClient;