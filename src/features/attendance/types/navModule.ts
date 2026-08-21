import type { LucideIcon } from "lucide-react";

export type AttendanceTabType =
  | "overview"
  | "checkin"
  | "shifts"
  | "rosters"
  | "holidays"
  | "regularization"
  | "timesheets"
  | "leaves"
  | "overtime"
  | "analytics";

export interface NavModule {
  id: AttendanceTabType;
  label: string;
  icon: LucideIcon;
}
