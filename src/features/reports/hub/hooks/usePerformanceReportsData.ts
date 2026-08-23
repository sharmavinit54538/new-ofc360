import { useGetPerformanceDashboardQuery, useGetPerformanceTrendsQuery, useGetKpiAttainmentQuery, useGetTopPerformersQuery, useGetSkillGapsQuery } from "../performanceReportsApi";
import type { ReportCategory } from "../types";

export function usePerformanceReportsData(activeCategory: ReportCategory) {
  const skip = activeCategory !== "performance";
  const { data: perfDashboardRes, isLoading: perfLoading, isError: perfError } = useGetPerformanceDashboardQuery(undefined, { skip });
  const { data: perfTrendsRes } = useGetPerformanceTrendsQuery(undefined, { skip });
  const { data: perfKpiRes } = useGetKpiAttainmentQuery(undefined, { skip });
  const { data: perfTopRes } = useGetTopPerformersQuery(undefined, { skip });
  const { data: perfSkillGapsRes } = useGetSkillGapsQuery(undefined, { skip });

  return { perfDashboardRes, perfLoading, perfError, perfTrendsRes, perfKpiRes, perfTopRes, perfSkillGapsRes };
}
