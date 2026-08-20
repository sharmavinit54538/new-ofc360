import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayCycle } from "../types";
const tag = "PayCycle";
export const payCyclesMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayCycle: builder.mutation<APIResponse<PayCycle>, Partial<PayCycle>>({ query: (body) => ({ url: "/v2/payroll/cycles", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updatePayCycle: builder.mutation<APIResponse<PayCycle>, { id: string; data: Partial<PayCycle> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/cycles/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    deletePayCycle: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    activatePayCycle: builder.mutation<APIResponse<PayCycle>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}/activate`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    lockPayCycle: builder.mutation<APIResponse<PayCycle>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}/lock`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    unlockPayCycle: builder.mutation<APIResponse<PayCycle>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}/unlock`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    duplicatePayCycle: builder.mutation<APIResponse<PayCycle>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}/duplicate`, method: "POST" }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    archivePayCycle: builder.mutation<APIResponse<PayCycle>, string>({ query: (id) => ({ url: `/v2/payroll/cycles/${id}/archive`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreatePayCycleMutation, useUpdatePayCycleMutation, useDeletePayCycleMutation, useActivatePayCycleMutation, useLockPayCycleMutation, useUnlockPayCycleMutation, useDuplicatePayCycleMutation, useArchivePayCycleMutation } = payCyclesMutationsApi;
