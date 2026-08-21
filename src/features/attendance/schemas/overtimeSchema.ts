export interface OvertimeFormData {
  overtimeHours: number;
  rateMultiplier: string;
  reason: string;
}

export function validateOvertimeForm(data: Partial<OvertimeFormData>): string | null {
  if (!data.reason?.trim()) return "Please enter a reason for overtime.";
  return null;
}
