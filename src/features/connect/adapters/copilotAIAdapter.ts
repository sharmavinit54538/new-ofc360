import { aiService } from '@/ai';

export const copilotAI = {
  name: 'copilot',

  async query(query: string, context?: Record<string, unknown>) {
    return aiService.copilotQuery(query, context);
  },

  async generateEmail(data: Record<string, unknown>) {
    return aiService.generateEmail(data);
  },

  async assessRisk(data: Record<string, unknown>) {
    return aiService.assessRisk(data);
  },

  async detectMood(text: string) {
    return aiService.detectMood(text);
  },
};

export default copilotAI;