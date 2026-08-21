export interface LeaveBalanceItem {
  employeeId: string;
  employeeName: string;
  casualLeavesRemaining: number;
  sickLeavesRemaining: number;
  earnedLeavesRemaining: number;
  [key: string]: any;
}
