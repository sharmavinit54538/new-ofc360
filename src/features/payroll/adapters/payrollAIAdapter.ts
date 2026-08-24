import { aiService } from '@/ai';

export const payrollAI = {
  name: 'payroll',

  async getDashboard() {
    return aiService.getPayrollDashboard();
  },

  async getForecast() {
    return aiService.getPayrollForecast();
  },

  async detectAnomalies() {
    return aiService.detectPayrollAnomalies();
  },

  async detectFraud() {
    return aiService.detectPayrollFraud();
  },

  async analyze(data: Record<string, unknown>) {
    return aiService.analyzePayroll(data);
  },

  async generateForecast(data: Record<string, unknown>) {
    return aiService.generatePayrollForecast(data);
  },
};

export default payrollAI;