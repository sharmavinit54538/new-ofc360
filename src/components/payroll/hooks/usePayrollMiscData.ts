import { useGetComplianceRulesQuery, useGetPayrollSettingsQuery, useGetSalaryProcessingQuery, useGetAiPayrollHealthScoreQuery, useGetAiPayrollAnomaliesQuery, useGetSalaryProcessingApprovalWorkflowQuery } from "@/features/payroll";

export function usePayrollMiscData(activeTab: string) {
  const { data: complianceRes, isLoading: isComplianceLoading } = useGetComplianceRulesQuery(undefined, { skip: activeTab !== "compliance" });
  const { data: settingsRes, isLoading: isSettingsLoading } = useGetPayrollSettingsQuery(undefined, { skip: activeTab !== "settings" });
  const { data: reportsAnalyticsRes } = useGetSalaryProcessingQuery(undefined, { skip: activeTab !== "reports" });
  const { data: aiHealthRes } = useGetAiPayrollHealthScoreQuery(undefined, { skip: activeTab !== "copilot" });
  const { data: aiAnomaliesRes } = useGetAiPayrollAnomaliesQuery(undefined, { skip: activeTab !== "copilot" });
  const { data: approvalWorkflowRes } = useGetSalaryProcessingApprovalWorkflowQuery(undefined, { skip: activeTab !== "approvals" });
  const backendSettings = settingsRes?.data || {
    currency: "INR (₹)", default_pay_cycle: "Monthly", auto_generate_payslips: true,
    tax_calculation_method: "New Tax Regime (Sec 115BAC)", overtime_calculation_base: "1.5x", approval_levels: 3,
  };
  return {
    isComplianceLoading, complianceList: complianceRes?.data || [],
    isSettingsLoading, backendSettings, reportsAnalyticsRes, aiHealthRes, aiAnomaliesRes, approvalWorkflowRes,
  };
}
