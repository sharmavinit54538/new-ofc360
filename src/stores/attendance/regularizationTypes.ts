export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  missedPunchType: "Check-In" | "Check-Out" | "Both";
  requestedTime: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  appliedAt?: string;
  approverName?: string;
  reviewComment?: string;
  [key: string]: unknown;
}