/**
 * Legacy barrel file — re-exports from the canonical reports API.
 * New code should import directly from "@/features/reports/api".
 */
export {
  reportsApi,
  useGetWorkforceReportQuery,
  useGetAttendanceReportQuery,
  useGetPayrollReportQuery,
  useGetRecruitmentReportQuery,
  useGetPerformanceReportQuery,
  useGetEngagementReportQuery,
  useGetComplianceReportQuery,
  useExportWorkforceReportQuery,
  useExportAttendanceReportQuery,
  useExportPayrollReportQuery,
  useGetDashboardMetricsQuery,
  useGetCustomReportQuery,
  useCreateCustomReportMutation,
  useScheduleReportMutation,
} from "@/features/reports/api";

export type {
  WorkforceReport,
  AttendanceReport,
  PayrollReport,
  RecruitmentReport,
  PerformanceReport,
  EngagementReport,
  ComplianceReport,
} from "@/features/reports/api";