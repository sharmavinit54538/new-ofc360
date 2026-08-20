export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  targetDate: string;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  category?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  cycleId: string;
  overallRating: number;
  comments?: string;
  status: 'pending' | 'submitted' | 'completed';
  completedAt?: string;
}