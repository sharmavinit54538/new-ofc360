export interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMins: number;
  department: string;
  halfDayHours?: number;
  fullDayHours?: number;
  breakDurationMins?: number;
}

export interface RosterFormData {
  employeeName: string;
  shiftName: string;
  dayOfWeek: string;
  department?: string;
}

export interface HolidayFormData {
  title: string;
  date: string;
  type: "National" | "Public" | "Optional Floating" | "Regional";
  branchLocation: string;
}

export interface RegularizationFormData {
  date: string;
  missedPunchType: "Check-In" | "Check-Out" | "Both";
  requestedTime: string;
  reason: string;
}

export interface TimesheetFormData {
  projectName: string;
  taskDescription: string;
  loggedHours: number;
  billable: boolean;
}

export interface OvertimeFormData {
  overtimeHours: number;
  rateMultiplier: string;
  reason: string;
}

export interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export function validateShiftForm(data: Partial<ShiftFormData>): string | null {
  if (!data.name?.trim()) return "Please enter a shift name.";
  if (!data.startTime) return "Please enter a start time.";
  if (!data.endTime) return "Please enter an end time.";
  return null;
}

export function validateRosterForm(data: Partial<RosterFormData>): string | null {
  if (!data.employeeName?.trim()) return "Please select an employee.";
  if (!data.shiftName) return "Please select a shift.";
  if (!data.dayOfWeek) return "Please select a day of week.";
  return null;
}

export function validateHolidayForm(data: Partial<HolidayFormData>): string | null {
  if (!data.title?.trim() || !data.date) return "Title and Date are required.";
  return null;
}

export function validateRegularizationForm(data: Partial<RegularizationFormData>): string | null {
  if (!data.date) return "Please select the missed attendance date.";
  const todayStr = new Date().toISOString().split("T")[0];
  if (data.date > todayStr) return "Regularization cannot be applied for future dates.";
  if (!data.requestedTime) return "Please specify the correct punch time.";
  if (!data.reason?.trim()) return "Please provide a justification reason.";
  return null;
}

export function validateTimesheetForm(data: Partial<TimesheetFormData>): string | null {
  if (!data.projectName?.trim() || !data.taskDescription?.trim()) {
    return "Project and Task details are required.";
  }
  return null;
}

export function validateOvertimeForm(data: Partial<OvertimeFormData>): string | null {
  if (!data.reason?.trim()) return "Please enter a reason for overtime.";
  return null;
}

export function validateLeaveForm(data: Partial<LeaveFormData>): string | null {
  if (!data.startDate || !data.endDate || !data.reason?.trim()) {
    return "Please fill all leave details.";
  }
  return null;
}
