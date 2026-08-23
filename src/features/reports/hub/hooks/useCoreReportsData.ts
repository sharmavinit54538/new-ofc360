import { useGetReportStatsQuery, useGetHeadcountAnalyticsQuery, useGetDepartmentAnalyticsQuery, useGetReportsQuery } from "../reportsCoreApi";

export function useCoreReportsData(searchTerm: string, selectedType: string) {
  const { data: statsRes, isLoading: statsLoading } = useGetReportStatsQuery();
  const { data: headcountRes, isLoading: headcountLoading } = useGetHeadcountAnalyticsQuery();
  const { data: deptRes, isLoading: deptLoading } = useGetDepartmentAnalyticsQuery();
  const { data: reportsRes, isLoading: reportsLoading } = useGetReportsQuery({
    search: searchTerm || undefined,
    type: selectedType || undefined,
    page: 1,
    limit: 100,
  });

  return { stats: statsRes?.data, statsLoading, headcountRes, headcountLoading, deptRes, deptLoading, reportsList: reportsRes?.data || [], reportsLoading };
}
