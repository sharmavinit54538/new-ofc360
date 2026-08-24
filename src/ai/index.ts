export { aiConfig, aiEndpoints, getAIEndpoint } from './config/aiConfig';
export type { AIConfig, AIEndpointKey } from './config/aiConfig';

export { aiClient } from './client/aiClient';
export type { } from './client/aiClient';

export { aiService } from './service/aiService';
export type { FeatureAIAdapter } from './service/aiService';

export * from './types';

export const AI_SERVICE_VERSION = '1.0.0';
export const AI_SERVICE_NAME = 'OFC360 AI Service';