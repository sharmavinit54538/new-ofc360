import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { normalizeRole } from "@/features/auth/authTypes";
import { useLeaveStore } from "@/stores/leaveStore";
import { useAttendanceStore } from "@/stores/attendanceStore";
import {
  useFaceCheckInMutation,
  useFaceCheckOutMutation,
  useGetMyFaceAttendanceQuery,
  useGetPersonalFaceHistoryQuery,
  useGetTeamFaceAttendanceQuery,
  useGetCompanyFaceAttendanceQuery,
  useGetFaceAttendanceAnalyticsQuery,
  useGetCalendarHolidaysQuery,
  useCreateCalendarHolidaysMutation,
  useDeleteCalendarHolidaysIdMutation,
  useGetLeavesHistoryQuery,
  useCreateLeavesApplyMutation,
  useCreateLeavesLeaveIdReviewMutation,
  useGetTimesheetsHistoryQuery,
  useCreateTimesheetsWeeklyMutation,
  useCreateTimesheetsTimesheetIdReviewMutation,
  useCreateV2ShiftsPlansMutation,
  useLazyGetExportsAttendanceQuery,
  useGetEmployeesQuery,
  type FaceAttendanceRecord,
} from "../services/attendanceApi";
import { useAttendanceCamera } from "./useAttendanceCamera";
import { useAttendanceModals } from "./useAttendanceModals";
import { useAttendanceFilters } from "./useAttendanceFilters";
import { useAttendanceActions } from "./useAttendanceActions";
import type {
  PunchRecord,
  HolidayItem,
  DisplayedLeave,
  DisplayedTimesheet,
  AttendanceKPIStats,
  AttendanceTabType,
} from "../types/attendance.types";

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

export function useAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") || "overview") as AttendanceTabType;
  const setTab = (tab: string) => setSearchParams({ tab });

  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || "employee");
  const isManagerOrAbove =
    userRole === "manager" || userRole === "hr_admin" || userRole === "super_admin";
  const isHrOrAdmin = userRole === "hr_admin" || userRole === "super_admin";

  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  // Local fallback/sync stores
  const {
    leaveRequests: localLeaves,
    addLeaveRequest: addLocalLeave,
    updateLeaveStatus: updateLocalLeaveStatus,
  } = useLeaveStore();

  const {
    punches,
    shifts,
    rosters,
    holidays: localHolidays,
    regularizations,
    timesheets: localTimesheets,
    overtimes,
    addPunch,
    addShift,
    deleteShift,
    addRoster,
    deleteRoster,
    addHoliday: addLocalHoliday,
    deleteHoliday: deleteLocalHoliday,
    addRegularization,
    updateRegularizationStatus,
    addTimesheet: addLocalTimesheet,
    updateTimesheetStatus: updateLocalTimesheetStatus,
    addOvertime,
    updateOvertimeStatus,
  } = useAttendanceStore();

  // Queries
  const {
    data: myFaceStatus,
    isLoading: isMyStatusLoading,
    refetch: refetchMyStatus,
  } = useGetMyFaceAttendanceQuery();

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetFaceAttendanceAnalyticsQuery();

  const {
    data: companyFaceData,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useGetCompanyFaceAttendanceQuery(
    { page: 1, limit: 20 },
    { skip: !isHrOrAdmin }
  );

  const {
    data: teamFaceData,
    isLoading: isTeamLoading,
    refetch: refetchTeam,
  } = useGetTeamFaceAttendanceQuery(
    { page: 1, limit: 20 },
    { skip: !isManagerOrAbove || isHrOrAdmin }
  );

  const {
    data: personalFaceData,
    isLoading: isPersonalLoading,
    refetch: refetchPersonal,
  } = useGetPersonalFaceHistoryQuery(
    { page: 1, limit: 20 },
    { skip: isManagerOrAbove }
  );

  const isLiveStreamLoading = isCompanyLoading || isTeamLoading || isPersonalLoading;

  // Live attendance stream merged from backend query + local punches
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

  // Mutations
  const [faceCheckIn, { isLoading: isCheckingIn }] = useFaceCheckInMutation();
  const [faceCheckOut, { isLoading: isCheckingOut }] = useFaceCheckOutMutation();

  const {
    data: holidaysApiRes,
    refetch: refetchHolidays,
  } = useGetCalendarHolidaysQuery(undefined);
  const [createHolidayApi, { isLoading: isCreatingHoliday }] = useCreateCalendarHolidaysMutation();
  const [deleteHolidayApi] = useDeleteCalendarHolidaysIdMutation();

  const {
    data: leavesApiRes,
    isLoading: isLeavesLoading,
    refetch: refetchLeaves,
  } = useGetLeavesHistoryQuery(undefined);
  const [applyLeaveApi, { isLoading: isApplyingLeave }] = useCreateLeavesApplyMutation();
  const [reviewLeaveApi] = useCreateLeavesLeaveIdReviewMutation();

  const {
    data: timesheetsApiRes,
    refetch: refetchTimesheets,
  } = useGetTimesheetsHistoryQuery(undefined);
  const [createTimesheetApi, { isLoading: isCreatingTimesheet }] = useCreateTimesheetsWeeklyMutation();
  const [reviewTimesheetApi] = useCreateTimesheetsTimesheetIdReviewMutation();

  const [createShiftPlanApi] = useCreateV2ShiftsPlansMutation();
  const [triggerAttendanceExport, { isFetching: isExporting }] = useLazyGetExportsAttendanceQuery();

  // Clock & Stopwatch State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [taskNotes, setTaskNotes] = useState("");

  // Sync clock status with backend response
  useEffect(() => {
    if (myFaceStatus) {
      if (myFaceStatus.status === "checked_in") {
        setIsClockedIn(true);
      } else if (myFaceStatus.status === "checked_out") {
        setIsClockedIn(false);
      }
    }
  }, [myFaceStatus]);

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn && !isOnBreak) {
        setWorkSeconds((prev) => prev + 1);
      } else if (isClockedIn && isOnBreak) {
        setBreakSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, isOnBreak]);

  // Camera Sub-hook
  const camera = useAttendanceCamera(activeTab);

  // Modals Sub-hook
  const modals = useAttendanceModals();

  // Filters Sub-hook
  const filters = useAttendanceFilters(regularizations);

  // Normalized Display Collections
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

  // KPI Calculations
  const totalEmployeesCount = analyticsData?.totalEmployees || employees.length || 0;
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
    pendingOvertimeCount: overtimes.length,
    attendanceRate: analyticsData?.attendanceRate ? `${analyticsData.attendanceRate}%` : "97.4%",
    absenteeismRate:
      analyticsData?.absentToday && totalEmployeesCount > 0
        ? `${((analyticsData.absentToday / totalEmployeesCount) * 100).toFixed(1)}%`
        : "1.8%",
    averageWorkingHours: "8.4 hrs/day",
  };

  // Actions Sub-hook
  const actions = useAttendanceActions({
    user,
    shifts,
    punches,
    liveAttendanceList,
    currentTime,
    isClockedIn,
    isOnBreak,
    workSeconds,
    breakSeconds,
    taskNotes,
    capturedSelfie: camera.capturedSelfie,
    setIsClockedIn,
    setIsOnBreak,
    setTaskNotes,
    addPunch,
    addShift,
    addRoster,
    addLocalHoliday,
    deleteLocalHoliday,
    addRegularization,
    updateRegularizationStatus,
    addLocalTimesheet,
    updateLocalTimesheetStatus,
    addOvertime,
    updateOvertimeStatus,
    addLocalLeave,
    updateLocalLeaveStatus,
    faceCheckIn,
    faceCheckOut,
    createHolidayApi,
    deleteHolidayApi,
    applyLeaveApi,
    reviewLeaveApi,
    createTimesheetApi,
    reviewTimesheetApi,
    createShiftPlanApi,
    triggerAttendanceExport,
    refetchMyStatus,
    refetchAnalytics,
    refetchCompany,
    refetchTeam,
    refetchPersonal,
    refetchHolidays,
    refetchLeaves,
    refetchTimesheets,
    isHrOrAdmin,
    isManagerOrAbove,
    modals,
  });

  return {
    activeTab,
    setTab,
    user,
    userRole,
    isHrOrAdmin,
    isManagerOrAbove,
    currentTime,
    isClockedIn,
    isOnBreak,
    workSeconds,
    breakSeconds,
    taskNotes,
    setTaskNotes,
    shifts,
    rosters,
    overtimes,
    regularizations,
    punches,
    liveAttendanceList,
    displayedHolidays,
    displayedLeaves,
    displayedTimesheets,
    stats,
    isMyStatusLoading,
    isAnalyticsLoading,
    isLeavesLoading,
    isLiveStreamLoading,
    isCheckingIn,
    isCheckingOut,
    isCreatingHoliday,
    isApplyingLeave,
    isCreatingTimesheet,
    isExporting,
    refetchAnalytics,
    refetchCompany,
    refetchTeam,
    refetchPersonal,
    deleteShift,
    deleteRoster,
    camera,
    modals,
    filters,
    actions,
  };
}
