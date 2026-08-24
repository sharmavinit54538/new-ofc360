export interface AIConfig {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  streaming: boolean;
}

export const aiConfig: AIConfig = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'backend',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4',
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '4096', 10),
  timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000', 10),
  streaming: import.meta.env.VITE_AI_STREAMING === 'true',
};

export const aiEndpoints = {
  chat: '/api/v1/ai/chat',
  complete: '/api/v1/ai/complete',
  analyze: '/api/v1/ai/analyze',
  embed: '/api/v1/ai/embedding',
  generate: '/api/v1/ai/generate',
  match: '/api/v1/ai/match',
  rank: '/api/v1/ai/rank',
  extract: '/api/v1/ai/extract',
  uploadResume: '/api/v1/ai/upload-resume',
  interview: '/api/v1/ai/interview',
  clear: '/api/v1/ai/clear',
  history: '/api/v1/ai/history',
  suggestions: '/api/v1/ai/suggestions',
  recruiter: {
    dashboard: '/api/v1/ai/recruiter/dashboard',
    funnel: '/api/v1/ai/recruiter/funnel',
    matchDistribution: '/api/v1/ai/recruiter/match-distribution',
    analytics: '/api/v1/ai/recruiter/analytics',
    candidateScore: (candidateId: string) => `/api/v1/ai/recruiter/candidate/${candidateId}/score`,
    candidateRecommendation: (candidateId: string) => `/api/v1/ai/recruiter/candidate/${candidateId}/recommendation`,
    analyzeResume: '/api/v1/ai/recruiter/resume/analyze',
    semanticMatch: '/api/v1/ai/recruiter/match',
    rankCandidates: '/api/v1/ai/recruiter/rank',
    generateQuestions: '/api/v1/ai/recruiter/interview/questions',
  },
  payroll: {
    dashboard: '/v1/ai/payroll/dashboard',
    forecast: '/v1/ai/payroll/forecast',
    costAnalysis: '/v1/ai/payroll/cost-analysis',
    costByDepartment: '/v1/ai/payroll/cost-by-department',
    benchmarking: '/v1/ai/payroll/benchmarking',
    anomalies: '/v1/ai/payroll/anomalies',
    fraudDetection: '/v1/ai/payroll/fraud-detection',
    healthScore: '/v1/ai/payroll/health-score',
    analytics: '/v1/ai/payroll/analytics',
    employee: (id: string) => `/v1/ai/payroll/employee/${id}`,
    generateForecast: '/v1/ai/payroll/forecast',
    analyze: '/v1/ai/payroll/analyze',
    detectAnomalies: '/v1/ai/payroll/detect-anomalies',
    detectFraud: '/v1/ai/payroll/detect-fraud',
  },
  attendance: {
    trend: '/api/v1/ai/attendance/trend',
    lateArrivals: '/api/v1/ai/attendance/late-arrivals',
    anomalies: '/api/v1/ai/attendance/anomalies',
  },
  intelligence: {
    models: '/api/v1/intelligence/models',
    modelById: (id: string) => `/api/v1/intelligence/models/${id}`,
    execute: (modelId: string) => `/api/v1/intelligence/models/${modelId}/execute`,
    executionStatus: (id: string) => `/api/v1/intelligence/executions/${id}`,
    history: '/api/v1/intelligence/executions/history',
    usage: '/api/v1/intelligence/usage',
  },
  mood: {
    detect: '/api/v2/mood/detect',
  },
  risk: {
    assess: '/api/v2/risk/assess',
  },
  emails: {
    generate: '/api/v2/emails/generate',
  },
  emotions: {
    sessions: '/api/v2/emotions/sessions',
    messages: (sessionId: string) => `/api/v2/emotions/sessions/${sessionId}/messages`,
  },
  copilot: {
    query: '/api/v2/copilot/query',
  },
};

export type AIEndpointKey = keyof typeof aiEndpoints;

export function getAIEndpoint(key: AIEndpointKey): string {
  return aiEndpoints[key];
}