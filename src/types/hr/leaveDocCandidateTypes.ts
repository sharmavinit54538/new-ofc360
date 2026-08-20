export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; leaveType: "casual" | "sick" | "earned" | "maternity" | "paternity" | "unpaid";
  startDate: string; endDate: string; totalDays: number; reason: string; status: "pending" | "approved" | "rejected"; appliedAt: string;
}

export interface Candidate {
  id: string; name: string; email: string; phone: string; position: string; department: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"; appliedDate: string; matchScore: number;
}

export interface DocItem {
  id: string; name: string; type: "policy" | "offer_letter" | "handbook" | "form" | "report";
  size: string; uploadedAt: string; url: string;
}