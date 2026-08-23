import { useGetHeadcountAnalyticsQuery } from "@/features/reports/reportsCoreApi";
import { useGetPerformanceDashboardQuery, useGetPerformanceTrendsQuery, useGetKpiAttainmentQuery, useGetTopPerformersQuery, useGetSkillGapsQuery } from "@/features/reports/performanceReportsApi";
import { useGetEngagementSummaryQuery, useGetEngagementTrendQuery, useGetEnpsTrendQuery, useGetEngagementBreakdownQuery, useGetEngagementSurveysQuery } from "@/features/reports/engagementReportsApi";
import { useGetCultureTelemetryQuery, useGetCultureTrendQuery, useGetCultureBreakdownQuery, useGetCultureFeedbackQuery } from "@/features/reports/cultureReportsApi";
import { useGetComplianceDashboardQuery, useGetComplianceRisksQuery, useGetAuditReadinessQuery, useGetSecurityAuditLogQuery } from "@/features/reports/complianceReportsApi";

export function useReportsPageQueries(activeTab: string) {
  const headcount = useGetHeadcountAnalyticsQuery(undefined, { skip: activeTab !== "workforce" });
  const perfDash = useGetPerformanceDashboardQuery(undefined, { skip: activeTab !== "performance" });
  const perfTrends = useGetPerformanceTrendsQuery(undefined, { skip: activeTab !== "performance" });
  const perfKpi = useGetKpiAttainmentQuery(undefined, { skip: activeTab !== "performance" });
  const perfTop = useGetTopPerformersQuery(undefined, { skip: activeTab !== "performance" });
  const perfSkills = useGetSkillGapsQuery(undefined, { skip: activeTab !== "performance" });
  const engSum = useGetEngagementSummaryQuery(undefined, { skip: activeTab !== "engagement" });
  const enpsTrend = useGetEnpsTrendQuery(undefined, { skip: activeTab !== "engagement" });
  const engBreak = useGetEngagementBreakdownQuery(undefined, { skip: activeTab !== "engagement" });
  const engSurveys = useGetEngagementSurveysQuery(undefined, { skip: activeTab !== "engagement" });
  const cultTelem = useGetCultureTelemetryQuery(undefined, { skip: activeTab !== "culture" });
  const cultTrend = useGetCultureTrendQuery(undefined, { skip: activeTab !== "culture" });
  const cultBreak = useGetCultureBreakdownQuery(undefined, { skip: activeTab !== "culture" });
  const cultFeedback = useGetCultureFeedbackQuery(undefined, { skip: activeTab !== "culture" });
  const compDash = useGetComplianceDashboardQuery(undefined, { skip: activeTab !== "compliance" });
  const compRisks = useGetComplianceRisksQuery(undefined, { skip: activeTab !== "compliance" });
  const compReadiness = useGetAuditReadinessQuery(undefined, { skip: activeTab !== "compliance" });
  const secAudit = useGetSecurityAuditLogQuery(undefined, { skip: activeTab !== "compliance" });

  return { headcount, perfDash, perfTrends, perfKpi, perfTop, perfSkills, engSum, enpsTrend, engBreak, engSurveys, cultTelem, cultTrend, cultBreak, cultFeedback, compDash, compRisks, compReadiness, secAudit };
}
