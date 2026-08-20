export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMins: number;
  halfDayHours: number;
  fullDayHours: number;
  breakDurationMins: number;
  department: string;
  [key: string]: any;
}

export interface RosterItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftName: string;
  timing: string;
  dayOfWeek: string;
  date: string;
  [key: string]: any;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: "National" | "Regional" | "Optional" | "Optional Floating" | string;
  mandatory: boolean;
  [key: string]: any;
}

export interface LeaveBalanceItem {
  employeeId: string;
  employeeName: string;
  casualLeavesRemaining: number;
  sickLeavesRemaining: number;
  earnedLeavesRemaining: number;
  [key: string]: any;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hoursWorked: number;
  project?: string;
  status: "draft" | "submitted" | "approved" | "rejected" | string;
  [key: string]: any;
}

export interface OvertimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  overtimeHours: number;
  rateMultiplier?: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | string;
  [key: string]: any;
}