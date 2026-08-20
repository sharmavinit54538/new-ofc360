export interface ShiftTiming {
  startTime: string;
  endTime: string;
  gracePeriodMins: number;
  halfDayHours?: number;
  fullDayHours?: number;
  breakDurationMins?: number;
}

export type AttendanceCalculatedStatus =
  | "On Time" | "Late" | "Half Day" | "Overtime" | "Early Departure"
  | "Missing Punch" | "On Leave" | "Holiday" | "Week Off" | "Regularized";
