import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Allowance } from "./types";
const tag = "Allowance";
export const allowancesMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAllowance: builder.mutation<APIResponse<Allowance>, Partial<Allowance>>({ query: (body) => ({ url: "/v2/payroll/allowances", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updateAllowance: builder.mutation<APIResponse<Allowance>, { id: string; data: Partial<Allowance> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/allowances/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deleteAllowance: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/allowances/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    duplicateAllowance: builder.mutation<APIResponse<Allowance>, string>({ query: (id) => ({ url: `/v2/payroll/allowances/${id}/duplicate`, method: "POST" }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    activateAllowance: builder.mutation<APIResponse<Allowance>, string>({ query: (id) => ({ url: `/v2/payroll/allowances/${id}/activate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deactivateAllowance: builder.mutation<APIResponse<Allowance>, string>({ query: (id) => ({ url: `/v2/payroll/allowances/${id}/deactivate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateAllowanceMutation, useUpdateAllowanceMutation, useDeleteAllowanceMutation, useDuplicateAllowanceMutation, useActivateAllowanceMutation, useDeactivateAllowanceMutation } = allowancesMutationsApi;
