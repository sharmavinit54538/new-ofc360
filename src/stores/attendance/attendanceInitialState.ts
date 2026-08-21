import { getStoredData } from "@/utils/storage";
import { DEFAULT_SHIFTS, DEFAULT_HOLIDAYS } from "./mockAttendanceData";

export const initialAttendanceStoreState = {
  punches: getStoredData("ofc360_attendance_punches_v1", []),
  shifts: getStoredData("ofc360_attendance_shifts_v1", []),
  rosters: [],
  holidays: [],
  regularizations: getStoredData("ofc360_attendance_regularizations_v1", []),
  regularizationRequests: [],
  timesheets: [],
  overtimes: [],
};
