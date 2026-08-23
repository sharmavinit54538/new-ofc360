import { useGetComplianceDashboardQuery, useGetComplianceRisksQuery, useGetAuditReadinessQuery, useGetSecurityAuditLogQuery } from "../complianceReportsApi";
import type { ReportCategory } from "../types";

export function useComplianceReportsData(activeCategory: ReportCategory) {
  const skip = activeCategory !== "compliance";
  const { data: compDashboardRes, isLoading: compLoading, isError: compError } = useGetComplianceDashboardQuery(undefined, { skip });
  const { data: compRisksRes } = useGetComplianceRisksQuery(undefined, { skip });
  const { data: compReadinessRes } = useGetAuditReadinessQuery(undefined, { skip });
  const { data: securityAuditRes } = useGetSecurityAuditLogQuery(undefined, { skip });

  return { compDashboardRes, compLoading, compError, compRisksRes, compReadinessRes, securityAuditRes };
}
