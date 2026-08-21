import {
  useGetTodayStatusQuery, useGetMyHistoryQuery, useGetTeamAttendanceQuery,
  useGetCompanyAttendanceQuery, useGetAttendanceAnalyticsSummaryQuery,
} from "../../attendanceApi";

export function useFaceAttendanceQueries(rr: { isHrOrAdmin: boolean; isManagerOrAbove: boolean }) {
  const { data: myFaceStatus, refetch: refetchToday } = useGetTodayStatusQuery();
  const { data: myFaceHistory, refetch: refetchMyHistory } = useGetMyHistoryQuery({ page: 1, limit: 30 });
  const { data: teamFaceData, refetch: refetchTeam } = useGetTeamAttendanceQuery({ page: 1, limit: 50 }, { skip: !rr.isManagerOrAbove });
  const { data: companyFaceData, refetch: refetchCompany } = useGetCompanyAttendanceQuery({ page: 1, limit: 100 }, { skip: !rr.isHrOrAdmin });
  const { data: analyticsData, refetch: refetchAnalytics, isFetching: isAnalyticsLoading } = useGetAttendanceAnalyticsSummaryQuery(undefined, { skip: !rr.isManagerOrAbove });

  const refetchFeeds = () => { refetchToday(); refetchMyHistory(); if (rr.isManagerOrAbove) refetchTeam(); if (rr.isHrOrAdmin) refetchCompany(); };
  return { myFaceStatus, myFaceHistory, teamFaceData, companyFaceData, analyticsData, refetchFeeds, refetchAnalytics, isAnalyticsLoading };
}
