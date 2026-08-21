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

export function validateShiftForm(data: Partial<ShiftFormData>): string | null {
  if (!data.name?.trim()) return "Please enter a shift name.";
  if (!data.startTime) return "Please enter a start time.";
  if (!data.endTime) return "Please enter an end time.";
  return null;
}
