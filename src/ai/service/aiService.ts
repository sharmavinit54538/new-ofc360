import { aiClient } from '../client/aiClient';
import {
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
  AIServiceOptions,
  AITaskType,
} from '../types';
import { aiConfig, aiEndpoints } from '../config/aiConfig';
import { OFC360_AI_ENGINE } from '../aiEngine';

interface FeatureAIAdapter {
  name: string;
  execute: (task: AITaskType, input: unknown, options?: AIServiceOptions) => Promise<unknown>;
}

class AIService {
  private client = aiClient;
  private config = aiConfig;
  private adapters: Map<string, FeatureAIAdapter> = new Map();

  getEngine() {
    return OFC360_AI_ENGINE;
  }

  getConfig() {
    return { ...this.config };
  }

  getEndpoints() {
    return aiEndpoints;
  }

  registerAdapter(adapter: FeatureAIAdapter) {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter(name: string): FeatureAIAdapter | undefined {
    return this.adapters.get(name);
  }

  async chat(request: AIChatRequest, options?: AIServiceOptions): Promise<AIChatResponse> {
    return this.client.chat(request, options);
  }

  async complete(request: AICompletionRequest, options?: AIServiceOptions): Promise<AICompletionResponse> {
    return this.client.complete(request, options);
  }

  async embed(request: AIEmbeddingRequest, options?: AIServiceOptions): Promise<AIEmbeddingResponse> {
    return this.client.embed(request, options);
  }

  async analyze(request: AIAnalyzeRequest, options?: AIServiceOptions): Promise<AIAnalyzeResponse> {
    return this.client.analyze(request, options);
  }

  async generate(request: AIGenerateRequest, options?: AIServiceOptions): Promise<AIGenerateResponse> {
    return this.client.generate(request, options);
  }

  async match(request: AIMatchRequest, options?: AIServiceOptions): Promise<AIMatchResponse> {
    return this.client.match(request, options);
  }

  async rank(request: AIRankRequest, options?: AIServiceOptions): Promise<AIRankResponse> {
    return this.client.rank(request, options);
  }

  async getModels(): Promise<AIModelMetadata[]> {
    return this.client.getModels();
  }

  async getModelById(id: string): Promise<AIModelMetadata> {
    return this.client.getModelById(id);
  }

  async executeModel(request: AIExecutionRequest, options?: AIServiceOptions): Promise<AIExecutionResponse> {
    return this.client.executeModel(request, options);
  }

  async executeCapability(capabilityId: string, inputData: unknown, parameters?: Record<string, unknown>, options?: AIServiceOptions): Promise<AIExecutionResponse> {
    return this.client.executeCapability(capabilityId, inputData, parameters, options);
  }

  async getExecutionStatus(id: string): Promise<AIExecutionResponse> {
    return this.client.getExecutionStatus(id);
  }

  async getExecutionHistory(modelId?: string): Promise<AIExecutionResponse[]> {
    return this.client.getExecutionHistory(modelId);
  }

  async getUsageStats(): Promise<AIUsageStats> {
    return this.client.getUsageStats();
  }

  async detectMood(text: string): Promise<{ mood: string; confidence: number }> {
    return this.client.detectMood(text);
  }

  async assessRisk(data: Record<string, unknown>): Promise<{ riskScore: number; factors: string[] }> {
    return this.client.assessRisk(data);
  }

  async generateEmail(data: Record<string, unknown>): Promise<{ content: string }> {
    return this.client.generateEmail(data);
  }

  async createEmotionSession(data: Record<string, unknown>): Promise<{ sessionId: string }> {
    return this.client.createEmotionSession(data);
  }

  async sendEmotionMessage(sessionId: string, message: string): Promise<{ response: string }> {
    return this.client.sendEmotionMessage(sessionId, message);
  }

  async copilotQuery(query: string, context?: Record<string, unknown>): Promise<{ answer: string }> {
    return this.client.copilotQuery(query, context);
  }

  async analyzeResume(file: File): Promise<{ skills: string[]; summary: string; experience_years: number }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.config.baseUrl}/api/v1/ai/recruiter/resume/analyze`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to analyze resume');
    return response.json();
  }

  async semanticMatch(candidateId: string, jobId: string): Promise<{ match_score: number; breakdown: Record<string, number> }> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/ai/recruiter/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ candidateId, jobId }),
    });
    if (!response.ok) throw new Error('Failed to match');
    return response.json();
  }

  async rankCandidatesForJob(jobId: string): Promise<Array<{ candidate_id: string; rank: number; score: number }>> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/ai/recruiter/rank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ jobId }),
    });
    if (!response.ok) throw new Error('Failed to rank candidates');
    return response.json();
  }

  async generateInterviewQuestions(input: { jobId: string; count: number; type: string }): Promise<{ questions: string[] }> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/ai/recruiter/interview/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to generate questions');
    return response.json();
  }

  async getRecruiterDashboard(): Promise<{ kpis: unknown; funnel: unknown; matchDistribution: unknown }> {
    const [kpis, funnel, matchDistribution] = await Promise.all([
      this.requestJson('/api/v1/ai/recruiter/dashboard'),
      this.requestJson('/api/v1/ai/recruiter/funnel'),
      this.requestJson('/api/v1/ai/recruiter/match-distribution'),
    ]);
    return { kpis, funnel, matchDistribution };
  }

  async getCandidateScore(candidateId: string): Promise<{ score: number; details: Record<string, number> }> {
    return this.requestJson(`/api/v1/ai/recruiter/candidate/${candidateId}/score`);
  }

  async getCandidateRecommendation(candidateId: string): Promise<{ recommendation: string; reasoning: string }> {
    return this.requestJson(`/api/v1/ai/recruiter/candidate/${candidateId}/recommendation`);
  }

  async getPayrollDashboard(): Promise<unknown> {
    return this.requestJson('/v1/ai/payroll/dashboard');
  }

  async getPayrollForecast(): Promise<unknown> {
    return this.requestJson('/v1/ai/payroll/forecast');
  }

  async detectPayrollAnomalies(): Promise<unknown[]> {
    return this.requestJson('/v1/ai/payroll/anomalies');
  }

  async detectPayrollFraud(): Promise<unknown> {
    return this.requestJson('/v1/ai/payroll/fraud-detection');
  }

  async analyzePayroll(data: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`${this.config.baseUrl}/v1/ai/payroll/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to analyze payroll');
    return response.json();
  }

  async generatePayrollForecast(data: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`${this.config.baseUrl}/v1/ai/payroll/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to generate forecast');
    return response.json();
  }

  async getAttendanceTrend(groupBy: string = 'daily'): Promise<unknown> {
    return this.requestJson(`/api/v1/ai/attendance/trend?group_by=${groupBy}`);
  }

  async getLateArrivals(): Promise<unknown> {
    return this.requestJson('/api/v1/ai/attendance/late-arrivals');
  }

  async getAttendanceAnomalies(): Promise<unknown> {
    return this.requestJson('/api/v1/ai/attendance/anomalies');
  }

  async executeIntelligenceModel(modelId: string, inputData: unknown, parameters?: Record<string, unknown>): Promise<AIExecutionResponse> {
    return this.client.executeModel({ modelId, inputData, parameters });
  }

  async getIntelligenceModels(): Promise<AIModelMetadata[]> {
    return this.client.getModels();
  }

  async getIntelligenceModelById(id: string): Promise<AIModelMetadata> {
    return this.client.getModelById(id);
  }

  async getIntelligenceUsageStats(): Promise<AIUsageStats> {
    return this.client.getUsageStats();
  }

  private async requestJson<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }
}

export const aiService = new AIService();
export default aiService;