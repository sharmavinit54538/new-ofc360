export interface HolidayFormData {
  title: string;
  date: string;
  type: "National" | "Public" | "Optional Floating" | "Regional";
  branchLocation: string;
}

export function validateHolidayForm(data: Partial<HolidayFormData>): string | null {
  if (!data.title?.trim() || !data.date) return "Title and Date are required.";
  return null;
}
