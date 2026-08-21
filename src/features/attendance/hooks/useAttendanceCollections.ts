import { useLiveAttendanceList } from "./collections/useLiveAttendanceList";
import { useDisplayedHolidays } from "./collections/useDisplayedHolidays";
import { useDisplayedLeaves } from "./collections/useDisplayedLeaves";
import { useDisplayedTimesheets } from "./collections/useDisplayedTimesheets";
import { useAttendanceKpiStats } from "./collections/useAttendanceKpiStats";

export function useAttendanceCollections(p: any) {
  const liveList = useLiveAttendanceList(p.isHrOrAdmin, p.isManagerOrAbove, p.companyFaceData, p.teamFaceData, p.personalFaceData, p.punches);
  const holidays = useDisplayedHolidays(p.holidaysApiRes, p.localHolidays);
  const leaves = useDisplayedLeaves(p.leavesApiRes, p.localLeaves);
  const timesheets = useDisplayedTimesheets(p.timesheetsApiRes, p.localTimesheets);
  const stats = useAttendanceKpiStats({ analyticsData: p.analyticsData, employeesCount: p.employeesCount, liveList, leaves, pendingOvertimeCount: p.pendingOvertimeCount });
  return { liveAttendanceList: liveList, displayedHolidays: holidays, displayedLeaves: leaves, displayedTimesheets: timesheets, stats };
}
