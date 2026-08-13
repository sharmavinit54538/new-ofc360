import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Bonus, PaginationQueryParams } from "./types";

export const bonusesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBonusPlans: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/bonus/plans",
        method: "GET",
      }),
      providesTags: [{ type: "Bonus", id: "PLANS" }],
    }),

    getBonuses: builder.query<APIResponse<Bonus[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/bonuses",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Bonus" as const, id })),
              { type: "Bonus", id: "LIST" },
            ]
          : [{ type: "Bonus", id: "LIST" }],
    }),

    createBonus: builder.mutation<APIResponse<Bonus>, Partial<Bonus>>({
      query: (body) => ({
        url: "/v2/payroll/bonuses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Bonus", id: "LIST" }],
    }),

    approveBonus: builder.mutation<APIResponse<Bonus>, string>({
      query: (bonusId) => ({
        url: `/v2/payroll/bonuses/${bonusId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Bonus", id },
        { type: "Bonus", id: "LIST" },
      ],
    }),

    rejectBonus: builder.mutation<APIResponse<Bonus>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/v2/payroll/bonuses/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Bonus", id },
        { type: "Bonus", id: "LIST" },
      ],
    }),

    bonusCopilotChat: builder.mutation<APIResponse<{ reply: string; [key: string]: any }>, { message: string }>({
      query: (body) => ({
        url: "/v2/payroll/bonuses/copilot",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBonusPlansQuery,
  useGetBonusesQuery,
  useCreateBonusMutation,
  useApproveBonusMutation,
  useRejectBonusMutation,
  useBonusCopilotChatMutation,
} = bonusesApi;
