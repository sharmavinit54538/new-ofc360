import {
  useGetPayrollPeriodsQuery,
  useGetPayrollRunsQuery,
  useGetPayrollAnalyticsQuery,
  useFinalizePayrollMutation,
  useRunPayrollMutation,
  useApprovePayoutMutation,
} from "@/services/api/payrollApi";

export function usePayroll(year?: number) {
  const { data: periods, isLoading: isLoadingPeriods } = useGetPayrollPeriodsQuery();
  const { data: runs, isLoading: isLoadingRuns } = useGetPayrollRunsQuery({ year });
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetPayrollAnalyticsQuery({ year });

  const [finalizePayroll, { isLoading: isFinalizing }] = useFinalizePayrollMutation();
  const [runPayroll, { isLoading: isRunning }] = useRunPayrollMutation();
  const [approvePayout, { isLoading: isApproving }] = useApprovePayoutMutation();

  return {
    periods: periods || [],
    runs: runs || [],
    analytics,
    isLoading: isLoadingPeriods || isLoadingRuns || isLoadingAnalytics,
    isProcessing: isFinalizing || isRunning || isApproving,
    finalizePayroll,
    runPayroll,
    approvePayout,
  };
}