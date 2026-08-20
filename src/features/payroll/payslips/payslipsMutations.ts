import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Payslip } from "../types";
const sp = "SalaryProcessing";
const pl = "Payslip";
export const payslipsMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bulkGeneratePayslips: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/payslips/bulk-generate", method: "POST", body }), invalidatesTags: [{ type: pl, id: "LIST" }, { type: sp, id: "LIST" }] }),
    bulkEmailPayslips: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/payslips/bulk-email", method: "POST", body }), invalidatesTags: [{ type: pl, id: "LIST" }] }),
    emailPayslip: builder.mutation<APIResponse<any>, string>({ query: (id) => ({ url: `/v2/payroll/payslips/${id}/email`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: pl, id }] }),
    regeneratePayslip: builder.mutation<APIResponse<Payslip>, string>({ query: (id) => ({ url: `/v2/payroll/payslips/${id}/regenerate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: pl, id }, { type: pl, id: "LIST" }, { type: sp, id: "LIST" }, { type: sp, id: "HERO" }, { type: sp, id: "KPIS" }] }),
    deletePayslip: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/payslips/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: pl, id }, { type: pl, id: "LIST" }, { type: sp, id: "LIST" }, { type: sp, id: "HERO" }, { type: sp, id: "KPIS" }] }),
  }),
});
export const { useBulkGeneratePayslipsMutation, useBulkEmailPayslipsMutation, useEmailPayslipMutation, useRegeneratePayslipMutation, useDeletePayslipMutation } = payslipsMutationsApi;
