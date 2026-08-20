import { baseApi } from "@/services/api/baseApi";
import { APIResponse, OvertimeEntry } from "../types";
const tag = "Overtime";
export const overtimeMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOvertimeEntry: builder.mutation<APIResponse<OvertimeEntry>, Partial<OvertimeEntry>>({ query: (body) => ({ url: "/v2/payroll/overtime", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    approveOvertime: builder.mutation<APIResponse<OvertimeEntry>, string>({ query: (id) => ({ url: `/v2/payroll/overtime/${id}/approve`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    rejectOvertime: builder.mutation<APIResponse<OvertimeEntry>, { id: string; reason?: string }>({ query: ({ id, reason }) => ({ url: `/v2/payroll/overtime/${id}/reject`, method: "POST", body: { reason } }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    overtimeCopilotChat: builder.mutation<APIResponse<any>, { message: string }>({ query: (body) => ({ url: "/v2/payroll/overtime/copilot", method: "POST", body }) }),
    updateOvertimeSettings: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/overtime/settings", method: "PUT", body }), invalidatesTags: [{ type: tag, id: "SETTINGS" }] }),
    calculateOvertime: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/overtime/calculate", method: "POST", body }) }),
    requestOvertime: builder.mutation<APIResponse<OvertimeEntry>, Partial<OvertimeEntry>>({ query: (body) => ({ url: "/v2/payroll/overtime/request", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
  }),
});
export const { useCreateOvertimeEntryMutation, useApproveOvertimeMutation, useRejectOvertimeMutation, useOvertimeCopilotChatMutation, useUpdateOvertimeSettingsMutation, useCalculateOvertimeMutation, useRequestOvertimeMutation } = overtimeMutationsApi;
