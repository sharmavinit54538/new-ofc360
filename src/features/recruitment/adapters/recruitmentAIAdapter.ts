import { aiService } from '@/ai';

export const recruitmentAI = {
  name: 'recruitment',

  async analyzeResume(file: File) {
    return aiService.analyzeResume(file);
  },

  async semanticMatch(candidateId: string, jobId: string) {
    return aiService.semanticMatch(candidateId, jobId);
  },

  async rankCandidatesForJob(jobId: string) {
    return aiService.rankCandidatesForJob(jobId);
  },

  async generateInterviewQuestions(input: { jobId: string; count: number; type: string }) {
    return aiService.generateInterviewQuestions(input);
  },

  async getDashboard() {
    return aiService.getRecruiterDashboard();
  },

  async getCandidateScore(candidateId: string) {
    return aiService.getCandidateScore(candidateId);
  },

  async getCandidateRecommendation(candidateId: string) {
    return aiService.getCandidateRecommendation(candidateId);
  },
};

export default recruitmentAI;