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
} from "../services/attendanceApi";

interface UseAttendanceQueriesProps {
  isHrOrAdmin: boolean;
  isManagerOrAbove: boolean;
}

export function useAttendanceQueries({
  isHrOrAdmin,
  isManagerOrAbove,
}: UseAttendanceQueriesProps) {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

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

  const [faceCheckIn, { isLoading: isCheckingIn }] = useFaceCheckInMutation();
  const [faceCheckOut, { isLoading: isCheckingOut }] = useFaceCheckOutMutation();

  const {
    data: holidaysApiRes,
    isLoading: isHolidaysLoading,
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
    isLoading: isTimesheetsLoading,
    refetch: refetchTimesheets,
  } = useGetTimesheetsHistoryQuery(undefined);
  const [createTimesheetApi, { isLoading: isCreatingTimesheet }] = useCreateTimesheetsWeeklyMutation();
  const [reviewTimesheetApi] = useCreateTimesheetsTimesheetIdReviewMutation();

  const [createShiftPlanApi] = useCreateV2ShiftsPlansMutation();
  const [triggerAttendanceExport, { isFetching: isExporting }] = useLazyGetExportsAttendanceQuery();

  return {
    employees,
    myFaceStatus,
    analyticsData,
    companyFaceData,
    teamFaceData,
    personalFaceData,
    isMyStatusLoading,
    isAnalyticsLoading,
    isLiveStreamLoading,
    isCheckingIn,
    isCheckingOut,
    isHolidaysLoading,
    isLeavesLoading,
    isTimesheetsLoading,
    isCreatingHoliday,
    isApplyingLeave,
    isCreatingTimesheet,
    isExporting,
    holidaysApiRes,
    leavesApiRes,
    timesheetsApiRes,
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
  };
}
