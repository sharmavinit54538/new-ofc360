import { baseApi } from "@/services/api/baseApi";
import { APIResponse } from "../types";
const TAGS = [
  { type: "SalaryProcessing" as const, id: "LIST" }, { type: "SalaryProcessing" as const, id: "HERO" },
  { type: "SalaryProcessing" as const, id: "KPIS" }, { type: "SalaryProcessing" as const, id: "WORKFLOW" },
  { type: "SalaryProcessing" as const, id: "INSIGHTS" }, { type: "SalaryProcessing" as const, id: "VALIDATIONS" },
  { type: "SalaryProcessing" as const, id: "ANALYTICS" }, { type: "PayCycle" as const, id: "LIST" },
  { type: "Payslip" as const, id: "LIST" },
];
export const batchSalaryProcessingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resolveSalaryProcessingException: builder.mutation<APIResponse<any>, { exception_id: string; [key: string]: any }>({ query: ({ exception_id, ...body }) => ({ url: `/v2/payroll/salary-processing/resolve-exception/${exception_id}`, method: "POST", body }), invalidatesTags: TAGS }),
    autoFixSalaryProcessing: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/auto-fix", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    batchPayoutSalaryProcessing: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/batch-payout", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    batchApproveSalaryProcessing: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/batch-approve", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    batchRecalculateSalaryProcessing: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/batch-recalculate", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
  }),
});
export const { useResolveSalaryProcessingExceptionMutation, useAutoFixSalaryProcessingMutation, useBatchPayoutSalaryProcessingMutation, useBatchApproveSalaryProcessingMutation, useBatchRecalculateSalaryProcessingMutation } = batchSalaryProcessingApi;
