import { useLiveAttendanceList } from "./collections/useLiveAttendanceList";
import { useDisplayedHolidays } from "./collections/useDisplayedHolidays";
import { useDisplayedLeaves } from "./collections/useDisplayedLeaves";
import { useDisplayedTimesheets } from "./collections/useDisplayedTimesheets";
import { useAttendanceKpiStats } from "./collections/useAttendanceKpiStats";
import type { PunchRecord, HolidayItem, DisplayedLeave, DisplayedTimesheet } from "../types/attendance.types";
import type { FaceAttendanceRecord } from "../services/attendanceApi";

export function useAttendanceCollections(props: {
  isHrOrAdmin: boolean; isManagerOrAbove: boolean; companyFaceData?: { items?: FaceAttendanceRecord[] };
  teamFaceData?: { items?: FaceAttendanceRecord[] }; personalFaceData?: { items?: FaceAttendanceRecord[] };
  punches: PunchRecord[]; holidaysApiRes: unknown; localHolidays: HolidayItem[]; leavesApiRes: unknown;
  localLeaves: DisplayedLeave[]; timesheetsApiRes: unknown; localTimesheets: DisplayedTimesheet[];
  analyticsData?: Record<string, number>; employeesCount: number; pendingOvertimeCount: number;
}) {
  const liveList = useLiveAttendanceList(props.isHrOrAdmin, props.isManagerOrAbove, props.companyFaceData, props.teamFaceData, props.personalFaceData, props.punches);
  const holidays = useDisplayedHolidays(props.holidaysApiRes, props.localHolidays);
  const leaves = useDisplayedLeaves(props.leavesApiRes, props.localLeaves);
  const timesheets = useDisplayedTimesheets(props.timesheetsApiRes, props.localTimesheets);
  const stats = useAttendanceKpiStats({ analyticsData: props.analyticsData, employeesCount: props.employeesCount, liveList, leaves, pendingOvertimeCount: props.pendingOvertimeCount });
  return { liveAttendanceList: liveList, displayedHolidays: holidays, displayedLeaves: leaves, displayedTimesheets: timesheets, stats };
}
