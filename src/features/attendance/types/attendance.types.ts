import type { LucideIcon } from "lucide-react";
import type {
  PunchRecord,
  ShiftTemplate,
  RosterItem,
  HolidayItem,
  RegularizationRequest,
  TimesheetEntry,
  OvertimeEntry,
} from "@/stores/attendanceStore";
import type { CameraCaptureResult } from "@/utils/verification/cameraVerification";

export * from "../types";
export type {
  PunchRecord,
  ShiftTemplate,
  RosterItem,
  HolidayItem,
  RegularizationRequest,
  TimesheetEntry,
  OvertimeEntry,
  CameraCaptureResult,
};

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

export interface DisplayedHoliday extends HolidayItem {
  branchLocation: string;
}

export interface DisplayedLeave {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
}

export interface DisplayedTimesheet {
  id: string;
  employeeName: string;
  projectName: string;
  taskDescription: string;
  loggedHours: number;
  billable: boolean;
  status: string;
}

export interface AttendanceKPIStats {
  totalEmployeesCount: number;
  presentTodayCount: number;
  lateArrivalsCount: number;
  onLeaveCount: number;
  remoteCount: number;
  pendingOvertimeCount: number;
  attendanceRate: string;
  absenteeismRate: string;
  averageWorkingHours: string;
}
