export interface OvertimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  standardHours?: number;
  actualHours?: number;
  overtimeHours: number;
  rateMultiplier?: string | number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "Pending" | "Approved" | "Rejected" | string;
  [key: string]: unknown;
}
