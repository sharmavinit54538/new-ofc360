import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Advance, PaginationQueryParams } from "./types";

export const advancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvances: builder.query<APIResponse<Advance[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/advances",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Advance" as const, id })),
              { type: "Advance", id: "LIST" },
            ]
          : [{ type: "Advance", id: "LIST" }],
    }),

    createAdvance: builder.mutation<APIResponse<Advance>, Partial<Advance>>({
      query: (body) => ({
        url: "/v2/payroll/advances",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Advance", id: "LIST" }],
    }),

    approveAdvance: builder.mutation<APIResponse<Advance>, string>({
      query: (loanId) => ({
        url: `/v2/payroll/advances/${loanId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, loanId) => [
        { type: "Advance", id: loanId },
        { type: "Advance", id: "LIST" },
      ],
    }),

    rejectAdvance: builder.mutation<APIResponse<Advance>, { loan_id: string; reason?: string }>({
      query: ({ loan_id, reason }) => ({
        url: `/v2/payroll/advances/${loan_id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { loan_id }) => [
        { type: "Advance", id: loan_id },
        { type: "Advance", id: "LIST" },
      ],
    }),

    advancesCopilotChat: builder.mutation<APIResponse<{ reply: string; [key: string]: any }>, { message: string }>({
      query: (body) => ({
        url: "/v2/payroll/advances/copilot",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdvancesQuery,
  useCreateAdvanceMutation,
  useApproveAdvanceMutation,
  useRejectAdvanceMutation,
  useAdvancesCopilotChatMutation,
} = advancesApi;
