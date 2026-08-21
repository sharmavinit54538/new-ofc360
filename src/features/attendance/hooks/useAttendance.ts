import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { normalizeRole } from "@/features/auth/authTypes";
import { useLeaveStore } from "@/stores/leaveStore";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { useAttendanceQueries } from "./useAttendanceQueries";
import { useAttendanceClock } from "./useAttendanceClock";
import { useAttendanceCollections } from "./useAttendanceCollections";
import { useAttendanceCamera } from "./useAttendanceCamera";
import { useAttendanceModals } from "./useAttendanceModals";
import { useAttendanceFilters } from "./useAttendanceFilters";
import { useAttendanceActions } from "./useAttendanceActions";
import type { AttendanceTabType } from "../types/attendance.types";

export function useAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") || "overview") as AttendanceTabType;
  const setTab = (tab: string) => setSearchParams({ tab });

  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || "employee");
  const isManagerOrAbove =
    userRole === "manager" || userRole === "hr_admin" || userRole === "super_admin";
  const isHrOrAdmin = userRole === "hr_admin" || userRole === "super_admin";

  // Stores
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
  const queries = useAttendanceQueries({
    isHrOrAdmin,
    isManagerOrAbove,
  });

  // Clock state & ticking
  const clock = useAttendanceClock(queries.myFaceStatus);

  // Camera Sub-hook
  const camera = useAttendanceCamera(activeTab);

  // Modals Sub-hook
  const modals = useAttendanceModals();

  // Filters Sub-hook
  const filters = useAttendanceFilters(regularizations);

  // Normalized Display Collections & Stats
  const collections = useAttendanceCollections({
    isHrOrAdmin,
    isManagerOrAbove,
    companyFaceData: queries.companyFaceData,
    teamFaceData: queries.teamFaceData,
    personalFaceData: queries.personalFaceData,
    punches,
    holidaysApiRes: queries.holidaysApiRes,
    localHolidays,
    leavesApiRes: queries.leavesApiRes,
    localLeaves: localLeaves as unknown as import("../types/attendance.types").DisplayedLeave[],
    timesheetsApiRes: queries.timesheetsApiRes,
    localTimesheets: localTimesheets as unknown as import("../types/attendance.types").DisplayedTimesheet[],
    analyticsData: queries.analyticsData,
    employeesCount: queries.employees.length,
    pendingOvertimeCount: overtimes.length,
  });

  // Actions Sub-hook
  const actions = useAttendanceActions({
    user,
    shifts,
    punches,
    liveAttendanceList: collections.liveAttendanceList,
    currentTime: clock.currentTime,
    isClockedIn: clock.isClockedIn,
    isOnBreak: clock.isOnBreak,
    workSeconds: clock.workSeconds,
    breakSeconds: clock.breakSeconds,
    taskNotes: clock.taskNotes,
    capturedSelfie: camera.capturedSelfie,
    setIsClockedIn: clock.setIsClockedIn,
    setIsOnBreak: clock.setIsOnBreak,
    setTaskNotes: clock.setTaskNotes,
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
    faceCheckIn: queries.faceCheckIn,
    faceCheckOut: queries.faceCheckOut,
    createHolidayApi: queries.createHolidayApi,
    deleteHolidayApi: queries.deleteHolidayApi,
    applyLeaveApi: queries.applyLeaveApi,
    reviewLeaveApi: queries.reviewLeaveApi,
    createTimesheetApi: queries.createTimesheetApi,
    reviewTimesheetApi: queries.reviewTimesheetApi,
    createShiftPlanApi: queries.createShiftPlanApi,
    triggerAttendanceExport: queries.triggerAttendanceExport,
    refetchMyStatus: queries.refetchMyStatus,
    refetchAnalytics: queries.refetchAnalytics,
    refetchCompany: queries.refetchCompany,
    refetchTeam: queries.refetchTeam,
    refetchPersonal: queries.refetchPersonal,
    refetchHolidays: queries.refetchHolidays,
    refetchLeaves: queries.refetchLeaves,
    refetchTimesheets: queries.refetchTimesheets,
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
    currentTime: clock.currentTime,
    isClockedIn: clock.isClockedIn,
    isOnBreak: clock.isOnBreak,
    workSeconds: clock.workSeconds,
    breakSeconds: clock.breakSeconds,
    taskNotes: clock.taskNotes,
    setTaskNotes: clock.setTaskNotes,
    shifts,
    rosters,
    overtimes,
    regularizations,
    punches,
    liveAttendanceList: collections.liveAttendanceList,
    displayedHolidays: collections.displayedHolidays,
    displayedLeaves: collections.displayedLeaves,
    displayedTimesheets: collections.displayedTimesheets,
    stats: collections.stats,
    isMyStatusLoading: queries.isMyStatusLoading,
    isAnalyticsLoading: queries.isAnalyticsLoading,
    isLeavesLoading: queries.isLeavesLoading,
    isLiveStreamLoading: queries.isLiveStreamLoading,
    isCheckingIn: queries.isCheckingIn,
    isCheckingOut: queries.isCheckingOut,
    isCreatingHoliday: queries.isCreatingHoliday,
    isApplyingLeave: queries.isApplyingLeave,
    isCreatingTimesheet: queries.isCreatingTimesheet,
    isExporting: queries.isExporting,
    refetchAnalytics: queries.refetchAnalytics,
    refetchCompany: queries.refetchCompany,
    refetchTeam: queries.refetchTeam,
    refetchPersonal: queries.refetchPersonal,
    deleteShift,
    deleteRoster,
    camera,
    modals,
    filters,
    actions,
  };
}
