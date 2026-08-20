import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_SHIFTS, DEFAULT_HOLIDAYS } from "./attendance/mockAttendanceData";
import { createAttendanceActions } from "./attendance/attendanceActions";

export type { PunchRecord } from "./attendance/punchTypes";
export type {
  ShiftTemplate,
  RosterItem,
  HolidayItem,
  LeaveBalanceItem,
  TimesheetEntry,
  OvertimeEntry,
} from "./attendance/shiftHolidayTypes";
export type { RegularizationRequest } from "./attendance/regularizationTypes";

export const useAttendanceStore = create<any>((set, get) => ({
  punches: getStoredData("ofc360_attendance_punches_v1", []),
  shifts: getStoredData("ofc360_attendance_shifts_v1", DEFAULT_SHIFTS),
  rosters: [],
  holidays: DEFAULT_HOLIDAYS,
  regularizations: getStoredData("ofc360_attendance_regularizations_v1", []),
  regularizationRequests: [],
  timesheets: [],
  overtimes: [],
  ...createAttendanceActions(set, get),
}));