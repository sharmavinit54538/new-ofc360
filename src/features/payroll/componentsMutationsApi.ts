import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryComponent } from "./types";
const tag = "SalaryComponent";
export const componentsMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, Partial<SalaryComponent>>({ query: (body) => ({ url: "/v2/payroll/components", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, { id: string; data: Partial<SalaryComponent> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/components/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deleteSalaryComponent: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/components/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    duplicateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({ query: (id) => ({ url: `/v2/payroll/components/${id}/duplicate`, method: "POST" }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    activateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({ query: (id) => ({ url: `/v2/payroll/components/${id}/activate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deactivateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({ query: (id) => ({ url: `/v2/payroll/components/${id}/deactivate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    reorderSalaryComponents: builder.mutation<APIResponse<any>, string[]>({ query: (body) => ({ url: "/v2/payroll/components/reorder", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateSalaryComponentMutation, useUpdateSalaryComponentMutation, useDeleteSalaryComponentMutation, useDuplicateSalaryComponentMutation, useActivateSalaryComponentMutation, useDeactivateSalaryComponentMutation, useReorderSalaryComponentsMutation } = componentsMutationsApi;
