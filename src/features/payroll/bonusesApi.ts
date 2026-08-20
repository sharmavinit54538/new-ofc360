import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Bonus, PaginationQueryParams } from "./types";
const tag = "Bonus" as const;
export const bonusesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBonusPlans: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/bonus/plans", providesTags: [{ type: tag, id: "PLANS" }] }),
    getBonuses: builder.query<APIResponse<Bonus[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/bonuses", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: tag, id })), { type: tag, id: "LIST" }] : [{ type: tag, id: "LIST" }] }),
    createBonus: builder.mutation<APIResponse<Bonus>, Partial<Bonus>>({ query: (body) => ({ url: "/v2/payroll/bonuses", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    approveBonus: builder.mutation<APIResponse<Bonus>, string>({ query: (id) => ({ url: `/v2/payroll/bonuses/${id}/approve`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    rejectBonus: builder.mutation<APIResponse<Bonus>, { id: string; reason?: string }>({ query: ({ id, reason }) => ({ url: `/v2/payroll/bonuses/${id}/reject`, method: "POST", body: { reason } }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    bonusCopilotChat: builder.mutation<APIResponse<any>, { message: string }>({ query: (body) => ({ url: "/v2/payroll/bonuses/copilot", method: "POST", body }) }),
  }),
});
export const { useGetBonusPlansQuery, useGetBonusesQuery, useCreateBonusMutation, useApproveBonusMutation, useRejectBonusMutation, useBonusCopilotChatMutation } = bonusesApi;