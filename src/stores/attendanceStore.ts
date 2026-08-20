import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_SHIFTS, DEFAULT_HOLIDAYS } from "./attendance/mockAttendanceData";
import { createAttendanceActions } from "./attendance/attendanceActions";

export type { PunchRecord } from "./attendance/punchTypes";
export type { ShiftTemplate, RosterItem, HolidayItem, LeaveBalanceItem } from "./attendance/shiftHolidayTypes";
export type { RegularizationRequest } from "./attendance/regularizationTypes";

export const useAttendanceStore = create<any>((set, get) => ({
  punchRecords: getStoredData("ofc360_attendance_punches_v1", []),
  shiftTemplates: getStoredData("ofc360_attendance_shifts_v1", DEFAULT_SHIFTS),
  roster: [], holidays: DEFAULT_HOLIDAYS, leaveBalances: [],
  regularizationRequests: getStoredData("ofc360_attendance_regularizations_v1", []),
  ...createAttendanceActions(set, get),
}));