import { aiService } from '@/ai';

export const attendanceAI = {
  name: 'attendance',

  async getTrend(groupBy: string = 'daily') {
    return aiService.getAttendanceTrend(groupBy);
  },

  async getLateArrivals() {
    return aiService.getLateArrivals();
  },

  async getAnomalies() {
    return aiService.getAttendanceAnomalies();
  },
};

export default attendanceAI;