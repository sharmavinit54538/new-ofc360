import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ReimbursementClaim, PaginationQueryParams } from "./types";

export const reimbursementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReimbursements: builder.query<APIResponse<ReimbursementClaim[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/reimbursements",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Reimbursement" as const, id })),
              { type: "Reimbursement", id: "LIST" },
            ]
          : [{ type: "Reimbursement", id: "LIST" }],
    }),

    createReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, Partial<ReimbursementClaim>>({
      query: (body) => ({
        url: "/v2/payroll/reimbursements",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reimbursement", id: "LIST" }],
    }),

    approveReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, string>({
      query: (claimId) => ({
        url: `/v2/payroll/reimbursements/${claimId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, claimId) => [
        { type: "Reimbursement", id: claimId },
        { type: "Reimbursement", id: "LIST" },
      ],
    }),

    rejectReimbursement: builder.mutation<APIResponse<ReimbursementClaim>, { claim_id: string; reason?: string }>({
      query: ({ claim_id, reason }) => ({
        url: `/v2/payroll/reimbursements/${claim_id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { claim_id }) => [
        { type: "Reimbursement", id: claim_id },
        { type: "Reimbursement", id: "LIST" },
      ],
    }),

    bulkApproveReimbursements: builder.mutation<APIResponse<any>, { claim_ids: string[] }>({
      query: (body) => ({
        url: "/v2/payroll/reimbursements/bulk-approve",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reimbursement", id: "LIST" }],
    }),

    getReimbursementsAuditLogs: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/reimbursements/audit-logs",
        method: "GET",
      }),
      providesTags: [{ type: "Reimbursement", id: "AUDIT" }],
    }),

    getReimbursementsAiInsights: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/reimbursements/ai-insights",
        method: "GET",
      }),
      providesTags: [{ type: "Reimbursement", id: "AI_INSIGHTS" }],
    }),

    reimbursementsCopilotChat: builder.mutation<APIResponse<{ reply: string; [key: string]: any }>, { message: string }>({
      query: (body) => ({
        url: "/v2/payroll/reimbursements/copilot",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReimbursementsQuery,
  useCreateReimbursementMutation,
  useApproveReimbursementMutation,
  useRejectReimbursementMutation,
  useBulkApproveReimbursementsMutation,
  useGetReimbursementsAuditLogsQuery,
  useGetReimbursementsAiInsightsQuery,
  useReimbursementsCopilotChatMutation,
} = reimbursementsApi;