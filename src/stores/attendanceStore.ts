import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_SHIFTS, DEFAULT_HOLIDAYS } from "./attendance/mockAttendanceData";
import { createAttendanceActions } from "./attendance/attendanceActions";

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