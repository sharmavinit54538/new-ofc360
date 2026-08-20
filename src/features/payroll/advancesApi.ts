import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Advance, PaginationQueryParams } from "./types";
const tag = "Advance" as const;
export const advancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvances: builder.query<APIResponse<Advance[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/advances", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: tag, id })), { type: tag, id: "LIST" }] : [{ type: tag, id: "LIST" }] }),
    createAdvance: builder.mutation<APIResponse<Advance>, Partial<Advance>>({ query: (body) => ({ url: "/v2/payroll/advances", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    approveAdvance: builder.mutation<APIResponse<Advance>, string>({ query: (id) => ({ url: `/v2/payroll/advances/${id}/approve`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    rejectAdvance: builder.mutation<APIResponse<Advance>, { loan_id: string; reason?: string }>({ query: ({ loan_id, reason }) => ({ url: `/v2/payroll/advances/${loan_id}/reject`, method: "POST", body: { reason } }), invalidatesTags: (_, __, { loan_id }) => [{ type: tag, id: loan_id }, { type: tag, id: "LIST" }] }),
    advancesCopilotChat: builder.mutation<APIResponse<any>, { message: string }>({ query: (body) => ({ url: "/v2/payroll/advances/copilot", method: "POST", body }) }),
  }),
});
export const { useGetAdvancesQuery, useCreateAdvanceMutation, useApproveAdvanceMutation, useRejectAdvanceMutation, useAdvancesCopilotChatMutation } = advancesApi;