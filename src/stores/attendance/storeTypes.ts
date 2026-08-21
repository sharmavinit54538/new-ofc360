import type { PunchRecord } from "./punchTypes";
import type { ShiftTemplate, RosterItem, HolidayItem, TimesheetEntry, OvertimeEntry } from "./shiftHolidayTypes";
import type { RegularizationRequest } from "./regularizationTypes";

export interface AttendanceStoreData {
  punches: PunchRecord[];
  shifts: ShiftTemplate[];
  rosters: RosterItem[];
  holidays: HolidayItem[];
  regularizations: RegularizationRequest[];
  regularizationRequests: RegularizationRequest[];
  timesheets: TimesheetEntry[];
  overtimes: OvertimeEntry[];
}

export type StoreSet = (fn: (s: AttendanceStoreData) => Partial<AttendanceStoreData>) => void;
export type StoreGet = () => AttendanceStoreData;
