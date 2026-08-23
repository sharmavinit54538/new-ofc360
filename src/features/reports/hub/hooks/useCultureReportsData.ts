import { useGetCultureTelemetryQuery, useGetCultureTrendQuery, useGetCultureBreakdownQuery, useGetCultureFeedbackQuery } from "../cultureReportsApi";
import type { ReportCategory } from "../types";

export function useCultureReportsData(activeCategory: ReportCategory) {
  const skip = activeCategory !== "culture";
  const { data: cultureRes, isLoading: cultureLoading, isError: cultureError } = useGetCultureTelemetryQuery(undefined, { skip });
  const { data: cultureTrendRes } = useGetCultureTrendQuery(undefined, { skip });
  const { data: cultureBreakdownRes } = useGetCultureBreakdownQuery(undefined, { skip });
  const { data: cultureFeedbackRes } = useGetCultureFeedbackQuery(undefined, { skip });

  return { cultureRes, cultureLoading, cultureError, cultureTrendRes, cultureBreakdownRes, cultureFeedbackRes };
}
