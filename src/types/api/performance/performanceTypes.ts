export interface PerformanceReview {
  id: string; employeeId: string; employeeName: string; reviewerId: string; reviewerName: string;
  period: string; ratings: { category: string; score: number; comments: string; }[];
  overallScore: number; feedback: string; status: 'draft' | 'submitted' | 'completed';
}
export interface Goal {
  id: string; employeeId: string; title: string; description: string;
  category: string; targetDate: string; progress: number; status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
}