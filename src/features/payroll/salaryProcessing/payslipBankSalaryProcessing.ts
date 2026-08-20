import { baseApi } from "@/services/api/baseApi";
import { APIResponse } from "../types";
const TAGS = [
  { type: "SalaryProcessing" as const, id: "LIST" }, { type: "SalaryProcessing" as const, id: "HERO" },
  { type: "SalaryProcessing" as const, id: "KPIS" }, { type: "SalaryProcessing" as const, id: "WORKFLOW" },
  { type: "SalaryProcessing" as const, id: "INSIGHTS" }, { type: "SalaryProcessing" as const, id: "VALIDATIONS" },
  { type: "SalaryProcessing" as const, id: "ANALYTICS" }, { type: "PayCycle" as const, id: "LIST" },
  { type: "Payslip" as const, id: "LIST" },
];
export const payslipBankSalaryProcessingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateSalaryProcessingPayslips: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/payslips", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    initiateSalaryProcessingBankTransfer: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/bank-transfer", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
    exportSalaryProcessing: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-processing/export", method: "POST", body: body || {} }), invalidatesTags: TAGS }),
  }),
});
export const { useGenerateSalaryProcessingPayslipsMutation, useInitiateSalaryProcessingBankTransferMutation, useExportSalaryProcessingMutation } = payslipBankSalaryProcessingApi;
