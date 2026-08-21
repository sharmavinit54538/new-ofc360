export interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export function validateLeaveForm(data: Partial<LeaveFormData>): string | null {
  if (!data.startDate || !data.endDate || !data.reason?.trim()) {
    return "Please fill all leave details.";
  }
  return null;
}
