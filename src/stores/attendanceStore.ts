import { create } from "zustand";
import { initialAttendanceStoreState } from "./attendance/attendanceInitialState";
import { createAttendanceActions } from "./attendance/attendanceActions";
import type { AttendanceStoreData } from "./attendance/storeTypes";

export type { PunchRecord } from "./attendance/punchTypes";
export type { ShiftTemplate, RosterItem, HolidayItem, LeaveBalanceItem, TimesheetEntry, OvertimeEntry } from "./attendance/shiftHolidayTypes";
export type { RegularizationRequest } from "./attendance/regularizationTypes";

export const useAttendanceStore = create<AttendanceStoreData & ReturnType<typeof createAttendanceActions>>((set, get) => ({
  ...initialAttendanceStoreState,
  ...createAttendanceActions(set, get),
}));