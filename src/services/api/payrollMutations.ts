import { baseApi } from "./baseApi";
import { PayrollPeriod } from "./payrollTypes";

export const payrollMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    runPayroll: builder.mutation<PayrollPeriod, { periodId: string }>({ query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/execute`, method: "POST" }), invalidatesTags: ["Payroll", "PayrollAnalytics"] }),
    finalizePayroll: builder.mutation<PayrollPeriod, { periodId: string }>({ query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/finalize`, method: "POST" }), invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"] }),
    approvePayout: builder.mutation<{ success: boolean; periodId: string }, { periodId: string }>({ query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/approve-payout`, method: "POST" }), invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"] }),
  }),
});
export const { useRunPayrollMutation, useFinalizePayrollMutation, useApprovePayoutMutation } = payrollMutationsApi;
