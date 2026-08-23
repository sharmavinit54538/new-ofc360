/**
 * Legacy barrel file — re-exports from the canonical payroll API.
 * New code should import directly from "@/features/payroll/api".
 */
export {
  payrollApi,
  useGetPayrollPeriodsQuery,
  useGetPayrollRunsQuery,
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  useGetPayrollAnalyticsQuery,
  useRunPayrollMutation,
  useFinalizePayrollMutation,
  useApprovePayoutMutation,
  useGeneratePayslipMutation,
  useDownloadPayslipQuery,
  useGetSalaryStructureQuery,
  useCreateSalaryStructureMutation,
  useUpdateSalaryStructureMutation,
} from "@/features/payroll/api";

export type {
  PayrollPeriod,
  Payslip,
  PayrollAnalytics,
  RunPayrollRequest,
  FinalizePayrollRequest,
  ApprovePayoutRequest,
} from "@/features/payroll/api";