export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  originalCheckIn?: string;
  originalCheckOut?: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  missedPunchType?: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  appliedAt: string;
  [key: string]: any;
}