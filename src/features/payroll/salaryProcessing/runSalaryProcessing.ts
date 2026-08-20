import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryProcessingRun } from "../types";
const TAGS = [
  { type: "SalaryProcessing" as const, id: "LIST" }, { type: "SalaryProcessing" as const, id: "HERO" },
  { type: "SalaryProcessing" as const, id: "KPIS" }, { type: "SalaryProcessing" as const, id: "WORKFLOW" },
  { type: "SalaryProcessing" as const, id: "INSIGHTS" }, { type: "SalaryProcessing" as const, id: "VALIDATIONS" },
  { type: "SalaryProcessing" as const, id: "ANALYTICS" }, { type: "PayCycle" as const, id: "LIST" },
  { type: "Payslip" as const, id: "LIST" },
];
export const runSalaryProcessingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    runSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/run", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    approveSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/approve", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    rollbackSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/rollback", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    recalculateEmployeeSalary: builder.mutation<APIResponse<any>, string>({ query: (employeeId) => ({ url: `/v2/payroll/salary-processing/recalculate/${employeeId}`, method: "POST" }), invalidatesTags: TAGS }),
  }),
});
export const { useRunSalaryProcessingMutation, useApproveSalaryProcessingMutation, useRollbackSalaryProcessingMutation, useRecalculateEmployeeSalaryMutation } = runSalaryProcessingApi;
