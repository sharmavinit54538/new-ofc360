import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ReimbursementClaim, PaginationQueryParams } from "./types";
const tag = "Reimbursement";
export const reimbursementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReimbursements: builder.query<APIResponse<ReimbursementClaim[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/reimbursements", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: tag as const, id })), { type: tag, id: "LIST" }] : [{ type: tag, id: "LIST" }] }),
    createReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, Partial<ReimbursementClaim>>({ query: (body) => ({ url: "/v2/payroll/reimbursements", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    approveReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, string>({ query: (id) => ({ url: `/v2/payroll/reimbursements/${id}/approve`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    rejectReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, { claim_id: string; reason?: string }>({ query: ({ claim_id, reason }) => ({ url: `/v2/payroll/reimbursements/${claim_id}/reject`, method: "POST", body: { reason } }), invalidatesTags: (_, __, { claim_id }) => [{ type: tag, id: claim_id }, { type: tag, id: "LIST" }] }),
    bulkApproveReimbursements: builder.mutation<APIResponse<any>, { claim_ids: string[] }>({ query: (body) => ({ url: "/v2/payroll/reimbursements/bulk-approve", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    getReimbursementsAuditLogs: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/reimbursements/audit-logs", providesTags: [{ type: tag, id: "AUDIT" }] }),
    getReimbursementsAiInsights: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/reimbursements/ai-insights", providesTags: [{ type: tag, id: "AI_INSIGHTS" }] }),
    reimbursementsCopilotChat: builder.mutation<APIResponse<any>, { message: string }>({ query: (body) => ({ url: "/v2/payroll/reimbursements/copilot", method: "POST", body }) }),
  }),
});
export const { useGetReimbursementsQuery, useCreateReimbursementMutation, useApproveReimbursementMutation, useRejectReimbursementMutation, useBulkApproveReimbursementsMutation, useGetReimbursementsAuditLogsQuery, useGetReimbursementsAiInsightsQuery, useReimbursementsCopilotChatMutation } = reimbursementsApi;