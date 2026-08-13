import { baseApi } from "./baseApi";

export interface ReimbursementClaim {
  id: string;
  claim_id?: string;
  employee_id: string;
  employee_name?: string;
  expenseCategory: string;
  expenseDate: string;
  amount: number;
  businessPurpose?: string;
  status: "pending" | "approved" | "rejected" | string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReimbursementCreate {
  expenseCategory: string;
  expenseDate: string;
  amount: number;
  businessPurpose?: string;
  employee_id?: string;
  receipt_url?: string;
}

export interface BulkApproveRequest {
  claim_ids: string[];
  note?: string;
}

export interface ApproveClaimRequest {
  claim_id: string;
  note?: string;
}

export interface RejectClaimRequest {
  claim_id: string;
  reason?: string;
}

export interface ReimbursementQueryParams {
  status?: string;
  employee_id?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ReimbursementAuditLog {
  id: string;
  claim_id: string;
  action: string;
  performed_by: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface SpendingAnomaly {
  claim_id: string;
  reason: string;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface ReimbursementAiInsights {
  total_claimed: number;
  flagged_claims_count: number;
  top_categories: CategorySpending[];
  spending_anomalies: SpendingAnomaly[];
  recommendations: string[];
}

export interface ReimbursementCopilotRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface ReimbursementCopilotResponse {
  answer: string;
  suggested_actions?: string[];
  relevant_claims?: ReimbursementClaim[];
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

export const reimbursementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReimbursements: builder.query<ReimbursementClaim[], ReimbursementQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.employee_id) searchParams.append("employee_id", params.employee_id);
        if (params?.category) searchParams.append("category", params.category);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        const q = searchParams.toString();
        return `/api/v2/payroll/reimbursements${q ? `?${q}` : ""}`;
      },
      keepUnusedDataFor: 60,
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: "Reimbursement" as const, id })),
          { type: "Reimbursement", id: "LIST" },
        ];
      },
    }),

    createReimbursement: builder.mutation<ReimbursementClaim, ReimbursementCreate>({
      query: (body) => ({
        url: "/api/v2/payroll/reimbursements",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Reimbursement", id: "LIST" }],
    }),

    approveReimbursement: builder.mutation<ReimbursementClaim, ApproveClaimRequest | string>({
      query: (arg) => {
        const claimId = typeof arg === "string" ? arg : arg.claim_id;
        const body = typeof arg === "string" ? {} : { note: arg.note };
        return {
          url: `/api/v2/payroll/reimbursements/${claimId}/approve`,
          method: "POST",
          body,
        };
      },
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, arg) => {
        const id = typeof arg === "string" ? arg : arg.claim_id;
        return [
          { type: "Reimbursement", id },
          { type: "Reimbursement", id: "LIST" },
        ];
      },
    }),

    rejectReimbursement: builder.mutation<ReimbursementClaim, RejectClaimRequest | string>({
      query: (arg) => {
        const claimId = typeof arg === "string" ? arg : arg.claim_id;
        const body = typeof arg === "string" ? {} : { reason: arg.reason };
        return {
          url: `/api/v2/payroll/reimbursements/${claimId}/reject`,
          method: "POST",
          body,
        };
      },
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, arg) => {
        const id = typeof arg === "string" ? arg : arg.claim_id;
        return [
          { type: "Reimbursement", id },
          { type: "Reimbursement", id: "LIST" },
        ];
      },
    }),

    bulkApproveReimbursements: builder.mutation<{ success: boolean; count: number }, BulkApproveRequest>({
      query: (body) => ({
        url: "/api/v2/payroll/reimbursements/bulk-approve",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Reimbursement", id: "LIST" }],
    }),

    getAuditLogs: builder.query<ReimbursementAuditLog[], { claim_id?: string; limit?: number } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.claim_id) searchParams.append("claim_id", params.claim_id);
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        const q = searchParams.toString();
        return `/api/v2/payroll/reimbursements/audit-logs${q ? `?${q}` : ""}`;
      },
      transformResponse: transformApiResponse,
      providesTags: ["ReimbursementAudit"],
    }),

    getAiInsights: builder.query<ReimbursementAiInsights, void>({
      query: () => "/api/v2/payroll/reimbursements/ai-insights",
      transformResponse: transformApiResponse,
      providesTags: ["ReimbursementInsights"],
    }),

    reimbursementsCopilot: builder.mutation<ReimbursementCopilotResponse, ReimbursementCopilotRequest>({
      query: (body) => ({
        url: "/api/v2/payroll/reimbursements/copilot",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
    }),
  }),
});

export const {
  useGetReimbursementsQuery,
  useCreateReimbursementMutation,
  useApproveReimbursementMutation,
  useRejectReimbursementMutation,
  useBulkApproveReimbursementsMutation,
  useGetAuditLogsQuery,
  useGetAiInsightsQuery,
  useReimbursementsCopilotMutation,
} = reimbursementsApi;
