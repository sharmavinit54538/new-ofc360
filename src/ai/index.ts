export { OFC360_AI_ENGINE } from './aiEngine';
export type { AIEngineConfig } from './aiEngine';

export {
  OFC360_AI_CAPABILITIES,
  ALL_71_AI_MODELS,
  getAICapabilities,
  getAICapabilityById,
  getAICapabilitiesByCategory,
} from './capabilities';
export type { AICapability, AIToolItem } from './capabilities';

export { aiConfig, aiEndpoints, getAIEndpoint } from './config/aiConfig';
export type { AIConfig, AIEndpointKey } from './config/aiConfig';

export { aiClient } from './client/aiClient';
export type { } from './client/aiClient';

export { aiService } from './service/aiService';
export type { FeatureAIAdapter } from './service/aiService';

export * from './types';

export const AI_SERVICE_VERSION = '2.0.0';
export const AI_SERVICE_NAME = 'OFC360 AI Engine';