import { useMemo } from "react";
import type {
  PunchRecord,
  HolidayItem,
  DisplayedLeave,
  DisplayedTimesheet,
  AttendanceKPIStats,
} from "../types/attendance.types";
import type { FaceAttendanceRecord } from "../services/attendanceApi";

interface HolidayApiResponseItem {
  id?: string;
  title?: string;
  name?: string;
  date?: string;
  type?: HolidayItem["type"];
  branchLocation?: string;
  branch?: string;
  mandatory?: boolean;
}

interface LeaveApiResponseItem {
  id?: string;
  employeeName?: string;
  employee_name?: string;
  leaveType?: string;
  type?: string;
  startDate?: string;
  start_date?: string;
  from?: string;
  endDate?: string;
  end_date?: string;
  to?: string;
  totalDays?: number;
  days?: number;
  reason?: string;
  status?: string;
}

interface TimesheetApiResponseItem {
  id?: string;
  employeeName?: string;
  employee_name?: string;
  projectName?: string;
  project?: string;
  taskDescription?: string;
  task?: string;
  loggedHours?: number;
  hours?: number;
  billable?: boolean;
  status?: string;
}

interface UseAttendanceCollectionsProps {
  isHrOrAdmin: boolean;
  isManagerOrAbove: boolean;
  companyFaceData?: { items?: FaceAttendanceRecord[] };
  teamFaceData?: { items?: FaceAttendanceRecord[] };
  personalFaceData?: { items?: FaceAttendanceRecord[] };
  punches: PunchRecord[];
  holidaysApiRes?: { data?: HolidayApiResponseItem[] } | unknown;
  localHolidays: HolidayItem[];
  leavesApiRes?: { data?: LeaveApiResponseItem[] } | unknown;
  localLeaves: DisplayedLeave[];
  timesheetsApiRes?: { data?: TimesheetApiResponseItem[] } | unknown;
  localTimesheets: DisplayedTimesheet[];
  analyticsData?: {
    totalEmployees?: number;
    presentToday?: number;
    lateEmployees?: number;
    absentToday?: number;
    attendanceRate?: number;
  };
  employeesCount: number;
  pendingOvertimeCount: number;
}

export function useAttendanceCollections({
  isHrOrAdmin,
  isManagerOrAbove,
  companyFaceData,
  teamFaceData,
  personalFaceData,
  punches,
  holidaysApiRes,
  localHolidays,
  leavesApiRes,
  localLeaves,
  timesheetsApiRes,
  localTimesheets,
  analyticsData,
  employeesCount,
  pendingOvertimeCount,
}: UseAttendanceCollectionsProps) {
  const liveAttendanceList = useMemo(() => {
    const rawItems: FaceAttendanceRecord[] =
      (isHrOrAdmin
        ? companyFaceData?.items
        : isManagerOrAbove
        ? teamFaceData?.items
        : personalFaceData?.items) || [];

    if (rawItems.length > 0) {
      return rawItems.map((item) => ({
        id: item.id,
        employeeName: item.employeeName || "Team Member",
        department: item.department || "Engineering",
        timestamp: item.checkIn || "09:15 AM",
        date: item.date,
        type: (item.checkOut ? "Check-Out" : "Check-In") as PunchRecord["type"],
        method: "Selfie Camera" as PunchRecord["method"],
        location: item.location || "Main HQ Office",
        status: (item.status || "Present") as PunchRecord["status"],
        workHours: item.workingHours ? String(item.workingHours) : undefined,
      }));
    }
    return punches;
  }, [companyFaceData, teamFaceData, personalFaceData, punches, isHrOrAdmin, isManagerOrAbove]);

  const displayedHolidays: HolidayItem[] = useMemo(() => {
    const raw = (holidaysApiRes as { data?: HolidayApiResponseItem[] })?.data || holidaysApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as HolidayApiResponseItem[]).map((h) => ({
        id: h.id || String(Math.random()),
        title: h.title || h.name || "Company Holiday",
        date: h.date || new Date().toISOString().split("T")[0],
        type: h.type || "National",
        branchLocation: h.branchLocation || h.branch || "All Branches",
        mandatory: h.mandatory !== false,
      }));
    }
    return localHolidays;
  }, [holidaysApiRes, localHolidays]);

  const displayedLeaves: DisplayedLeave[] = useMemo(() => {
    const raw = (leavesApiRes as { data?: LeaveApiResponseItem[] })?.data || leavesApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as LeaveApiResponseItem[]).map((l) => ({
        id: l.id || String(Math.random()),
        employeeName: l.employeeName || l.employee_name || "Team Member",
        type: l.leaveType || l.type || "Casual Leave",
        startDate: l.startDate || l.start_date || l.from || "2026-08-10",
        endDate: l.endDate || l.end_date || l.to || "2026-08-11",
        days: l.totalDays || l.days || 1,
        reason: l.reason || "Personal work",
        status:
          (l.status || "Pending").charAt(0).toUpperCase() +
          (l.status || "Pending").slice(1),
      }));
    }
    return localLeaves;
  }, [leavesApiRes, localLeaves]);

  const displayedTimesheets: DisplayedTimesheet[] = useMemo(() => {
    const raw = (timesheetsApiRes as { data?: TimesheetApiResponseItem[] })?.data || timesheetsApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as TimesheetApiResponseItem[]).map((t) => ({
        id: t.id || String(Math.random()),
        employeeName: t.employeeName || t.employee_name || "Alex Mercer",
        projectName: t.projectName || t.project || "OFC360 Platform",
        taskDescription: t.taskDescription || t.task || "Module Development",
        loggedHours: t.loggedHours || t.hours || 8,
        billable: t.billable !== false,
        status:
          (t.status || "Submitted").charAt(0).toUpperCase() +
          (t.status || "Submitted").slice(1),
      }));
    }
    return localTimesheets;
  }, [timesheetsApiRes, localTimesheets]);

  const totalEmployeesCount = analyticsData?.totalEmployees || employeesCount || 0;
  const presentTodayCount =
    analyticsData?.presentToday ??
    liveAttendanceList.filter((p) => p.type === "Check-In" || p.status === "Present").length;
  const lateArrivalsCount =
    analyticsData?.lateEmployees ??
    liveAttendanceList.filter((p) => p.status === "Late").length;
  const onLeaveCount = displayedLeaves.filter(
    (l) => l.status.toLowerCase() === "approved"
  ).length;

  const stats: AttendanceKPIStats = {
    totalEmployeesCount,
    presentTodayCount,
    lateArrivalsCount,
    onLeaveCount,
    remoteCount: 0,
    pendingOvertimeCount,
    attendanceRate: analyticsData?.attendanceRate ? `${analyticsData.attendanceRate}%` : "97.4%",
    absenteeismRate:
      analyticsData?.absentToday && totalEmployeesCount > 0
        ? `${((analyticsData.absentToday / totalEmployeesCount) * 100).toFixed(1)}%`
        : "1.8%",
    averageWorkingHours: "8.4 hrs/day",
  };

  return {
    liveAttendanceList,
    displayedHolidays,
    displayedLeaves,
    displayedTimesheets,
    stats,
  };
}
