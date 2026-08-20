import { baseApi } from "@/services/api/baseApi";
import { APIResponse, TaxSetting } from "../types";
const tag = "Tax";
export const taxMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTax: builder.mutation<APIResponse<TaxSetting>, Partial<TaxSetting>>({ query: (body) => ({ url: "/v2/payroll/taxes", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updateTax: builder.mutation<APIResponse<TaxSetting>, { id: string; data: Partial<TaxSetting> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/taxes/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deleteTax: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/taxes/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    importTaxes: builder.mutation<APIResponse<any>, Record<string, any>>({ query: (body) => ({ url: "/v2/payroll/taxes/import", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    recalculateTaxes: builder.mutation<APIResponse<any>, Record<string, any> | void>({ query: (body) => ({ url: "/v2/payroll/taxes/recalculate", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    activateTax: builder.mutation<APIResponse<TaxSetting>, string>({ query: (id) => ({ url: `/v2/payroll/taxes/${id}/activate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deactivateTax: builder.mutation<APIResponse<TaxSetting>, string>({ query: (id) => ({ url: `/v2/payroll/taxes/${id}/deactivate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateTaxMutation, useUpdateTaxMutation, useDeleteTaxMutation, useImportTaxesMutation, useRecalculateTaxesMutation, useActivateTaxMutation, useDeactivateTaxMutation } = taxMutationsApi;
