import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Deduction } from "./types";
const tag = "Deduction";
export const deductionsMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDeduction: builder.mutation<APIResponse<Deduction>, Partial<Deduction>>({ query: (body) => ({ url: "/v2/payroll/deductions", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updateDeduction: builder.mutation<APIResponse<Deduction>, { id: string; data: Partial<Deduction> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/deductions/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deleteDeduction: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/deductions/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateDeductionMutation, useUpdateDeductionMutation, useDeleteDeductionMutation } = deductionsMutationsApi;
