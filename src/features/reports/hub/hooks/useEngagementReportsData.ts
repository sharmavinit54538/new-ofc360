import { useGetEngagementSummaryQuery, useGetEnpsTrendQuery, useGetEngagementBreakdownQuery, useGetEngagementSurveysQuery } from "../engagementReportsApi";
import type { ReportCategory } from "../types";

export function useEngagementReportsData(activeCategory: ReportCategory) {
  const skip = activeCategory !== "engagement";
  const { data: engagementRes, isLoading: engagementLoading, isError: engagementError } = useGetEngagementSummaryQuery(undefined, { skip });
  const { data: enpsTrendRes } = useGetEnpsTrendQuery(undefined, { skip });
  const { data: engagementBreakdownRes } = useGetEngagementBreakdownQuery(undefined, { skip });
  const { data: engagementSurveysRes } = useGetEngagementSurveysQuery(undefined, { skip });

  return { engagementRes, engagementLoading, engagementError, enpsTrendRes, engagementBreakdownRes, engagementSurveysRes };
}
