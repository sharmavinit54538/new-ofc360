export interface RegularizationFormData {
  date: string;
  missedPunchType: "Check-In" | "Check-Out" | "Both";
  requestedTime: string;
  reason: string;
}

export function validateRegularizationForm(data: Partial<RegularizationFormData>): string | null {
  if (!data.date) return "Please select the missed attendance date.";
  const todayStr = new Date().toISOString().split("T")[0];
  if (data.date > todayStr) return "Regularization cannot be applied for future dates.";
  if (!data.requestedTime) return "Please specify the correct punch time.";
  if (!data.reason?.trim()) return "Please provide a justification reason.";
  return null;
}
