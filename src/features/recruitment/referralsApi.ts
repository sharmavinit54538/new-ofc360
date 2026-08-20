import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  Referral,
  ReferralCreateInput,
  ReferralStatusUpdateInput,
} from "./types";

/**
 * Note: backend has no dedicated "generate unique referral link" endpoint —
 * if the UI needs a shareable link, derive/construct it client-side from the
 * referrer's employee ID (e.g. `https://company.careers/jobs?ref=${referrerId}`)
 * rather than expecting a new API.
 */

export const referralsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferrals: builder.query<APIResponse<Referral[]>, void>({
      query: () => "/api/v1/referrals",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Referral" as const,
                id,
              })),
              { type: "Referral", id: "LIST" },
            ]
          : [{ type: "Referral", id: "LIST" }],
    }),

    submitReferral: builder.mutation<
      APIResponse<Referral>,
      ReferralCreateInput
    >({
      query: (body) => ({
        url: "/api/v1/referrals",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Referral", id: "LIST" }],
    }),

    updateReferralStatus: builder.mutation<
      APIResponse<Referral>,
      { id: string; body: ReferralStatusUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/referrals/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Referral", id: "LIST" },
        { type: "Referral", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReferralsQuery,
  useSubmitReferralMutation,
  useUpdateReferralStatusMutation,
} = referralsApi;