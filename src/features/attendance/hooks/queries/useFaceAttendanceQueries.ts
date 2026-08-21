import {
  useGetMyFaceAttendanceQuery,
  useGetPersonalFaceHistoryQuery,
  useGetTeamFaceAttendanceQuery,
  useGetCompanyFaceAttendanceQuery,
  useGetFaceAttendanceAnalyticsQuery,
} from "../services/attendanceApi";

export function useFaceAttendanceQueries(isHrOrAdmin: boolean, isManagerOrAbove: boolean) {
  const { data: myFaceStatus, isLoading: isMyStatusLoading, refetch: refetchMyStatus } = useGetMyFaceAttendanceQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useGetFaceAttendanceAnalyticsQuery();
  const { data: companyFaceData, isLoading: isCompanyLoading, refetch: refetchCompany } = useGetCompanyFaceAttendanceQuery({ page: 1, limit: 20 }, { skip: !isHrOrAdmin });
  const { data: teamFaceData, isLoading: isTeamLoading, refetch: refetchTeam } = useGetTeamFaceAttendanceQuery({ page: 1, limit: 20 }, { skip: !isManagerOrAbove || isHrOrAdmin });
  const { data: personalFaceData, isLoading: isPersonalLoading, refetch: refetchPersonal } = useGetPersonalFaceHistoryQuery({ page: 1, limit: 20 }, { skip: isManagerOrAbove });
  const isLiveStreamLoading = isCompanyLoading || isTeamLoading || isPersonalLoading;

  return { myFaceStatus, isMyStatusLoading, refetchMyStatus, analyticsData, isAnalyticsLoading, refetchAnalytics, companyFaceData, teamFaceData, personalFaceData, isLiveStreamLoading, refetchCompany, refetchTeam, refetchPersonal };
}
