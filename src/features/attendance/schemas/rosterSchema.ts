export interface RosterFormData {
  employeeName: string;
  shiftName: string;
  dayOfWeek: string;
  department?: string;
}

export function validateRosterForm(data: Partial<RosterFormData>): string | null {
  if (!data.employeeName?.trim()) return "Please select an employee.";
  if (!data.shiftName) return "Please select a shift.";
  if (!data.dayOfWeek) return "Please select a day of week.";
  return null;
}
