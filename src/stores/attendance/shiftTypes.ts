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
