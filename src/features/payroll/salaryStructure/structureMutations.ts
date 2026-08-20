import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryStructure } from "../types";
const tag = "SalaryStructure";
export const structureMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, Partial<SalaryStructure>>({ query: (body) => ({ url: "/v2/payroll/salary-structures", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updateSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, { id: string; data: Partial<SalaryStructure> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/salary-structures/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    cloneSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, string>({ query: (id) => ({ url: `/v2/payroll/salary-structures/${id}/clone`, method: "POST" }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    assignSalaryStructure: builder.mutation<APIResponse<any>, { employee_id: string; structure_id: string; [key: string]: any }>({ query: (body) => ({ url: "/v2/payroll/salary-structures/assign", method: "POST", body }), invalidatesTags: (_, __, { employee_id }) => [{ type: tag, id: "LIST" }, { type: tag, id: `EMP_${employee_id}` }] }),
    approveSalaryStructure: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-structures/approve", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    rollbackSalaryStructure: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/salary-structures/rollback", method: "POST", body: body || {} }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    deleteSalaryStructure: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/salary-structures/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateSalaryStructureMutation, useUpdateSalaryStructureMutation, useCloneSalaryStructureMutation, useAssignSalaryStructureMutation, useApproveSalaryStructureMutation, useRollbackSalaryStructureMutation, useDeleteSalaryStructureMutation } = structureMutationsApi;
