export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycle: string;
  rating: number;
  feedback: string;
  status: "draft" | "submitted" | "approved";
  createdAt: string;
}
