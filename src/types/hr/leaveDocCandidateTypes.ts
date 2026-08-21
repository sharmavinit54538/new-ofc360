export interface LeaveRequest {
  id: string;
  employeeId?: string;
  employeeName?: string;
  leaveType?: "casual" | "sick" | "earned" | "maternity" | "paternity" | "unpaid" | string;
  type?: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt?: string;
  dates?: string;
  userName?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected" | string;
  appliedDate: string;
  matchScore: number;
}

export interface DocItem {
  id: string;
  name: string;
  category?: "Policy" | "Contract" | "Report" | "Compliance" | string;
  type?: "policy" | "offer_letter" | "handbook" | "form" | "report" | string;
  size: string;
  author?: string;
  updatedAt?: string;
  uploadedAt?: string;
  status?: string;
  url?: string;
}