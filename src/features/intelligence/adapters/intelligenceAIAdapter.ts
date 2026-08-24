import { aiService } from '@/ai';

export const intelligenceAI = {
  name: 'intelligence',

  async executeModel(modelId: string, inputData: unknown, parameters?: Record<string, unknown>) {
    return aiService.executeIntelligenceModel(modelId, inputData, parameters);
  },

  async getModels() {
    return aiService.getIntelligenceModels();
  },

  async getModelById(id: string) {
    return aiService.getIntelligenceModelById(id);
  },

  async getUsageStats() {
    return aiService.getIntelligenceUsageStats();
  },
};

export default intelligenceAI;