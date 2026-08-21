import { useLiveAttendanceList } from "./collections/useLiveAttendanceList";
import { useDisplayedHolidays } from "./collections/useDisplayedHolidays";
import { useDisplayedLeaves } from "./collections/useDisplayedLeaves";
import { useDisplayedTimesheets } from "./collections/useDisplayedTimesheets";
import { useAttendanceKpiStats } from "./collections/useAttendanceKpiStats";
import type { PunchRecord, HolidayItem, DisplayedLeave, DisplayedTimesheet } from "../types/attendance.types";

export function useAttendanceCollections(p: Record<string, unknown>) {
  const liveList = useLiveAttendanceList(!!p.isHrOrAdmin, !!p.isManagerOrAbove, p.companyFaceData as unknown as Parameters<typeof useLiveAttendanceList>[2], p.teamFaceData as unknown as Parameters<typeof useLiveAttendanceList>[3], p.personalFaceData as unknown as Parameters<typeof useLiveAttendanceList>[4], (p.punches as unknown as PunchRecord[]) || []);
  const holidays = useDisplayedHolidays(p.holidaysApiRes, (p.localHolidays as unknown as HolidayItem[]) || []);
  const leaves = useDisplayedLeaves(p.leavesApiRes, (p.localLeaves as unknown as DisplayedLeave[]) || []);
  const timesheets = useDisplayedTimesheets(p.timesheetsApiRes, (p.localTimesheets as unknown as DisplayedTimesheet[]) || []);
  const stats = useAttendanceKpiStats({ analyticsData: p.analyticsData as unknown as Parameters<typeof useAttendanceKpiStats>[0]["analyticsData"], employeesCount: Number(p.employeesCount) || 0, liveList, leaves, pendingOvertimeCount: Number(p.pendingOvertimeCount) || 0 });
  return { liveAttendanceList: liveList, displayedHolidays: holidays, displayedLeaves: leaves, displayedTimesheets: timesheets, stats };
}
