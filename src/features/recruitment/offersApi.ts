import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  OfferLetter,
  OfferCreateInput,
  ConvertCandidateInput,
} from "./types";

export const offersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOffer: builder.mutation<
      APIResponse<OfferLetter>,
      { applicationId: string; body: OfferCreateInput }
    >({
      query: ({ applicationId, body }) => ({
        url: `/api/v1/applications/${applicationId}/offer`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Offer", id: "LIST" },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    convertCandidateToEmployee: builder.mutation<
      APIResponse<{ success: boolean; employee_id: string }>,
      { applicationId: string; body: ConvertCandidateInput }
    >({
      query: ({ applicationId, body }) => ({
        url: `/api/v1/applications/${applicationId}/convert`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Offer", id: "LIST" },
        { type: "Candidate", id: "LIST" },
        { type: "Employee", id: "LIST" },
      ],
    }),

    getOffers: builder.query<
      APIResponse<OfferLetter[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        const queryStr = queryParams.toString();
        return `/api/v1/offers${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Offer" as const,
                id,
              })),
              { type: "Offer", id: "LIST" },
            ]
          : [{ type: "Offer", id: "LIST" }],
    }),

    acceptOffer: builder.mutation<
      APIResponse<OfferLetter>,
      { offerId: string; candidateId?: string }
    >({
      query: ({ offerId }) => ({
        url: `/api/v1/offers/${offerId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (_res, _err, { offerId, candidateId }) => [
        { type: "Offer", id: "LIST" },
        { type: "Offer", id: offerId },
        { type: "Candidate", id: "LIST" },
        ...(candidateId ? [{ type: "Candidate" as const, id: candidateId }] : []),
      ],
    }),

    rejectOffer: builder.mutation<
      APIResponse<OfferLetter>,
      { offerId: string; candidateId?: string; reason?: string }
    >({
      query: ({ offerId, reason }) => ({
        url: `/api/v1/offers/${offerId}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_res, _err, { offerId, candidateId }) => [
        { type: "Offer", id: "LIST" },
        { type: "Offer", id: offerId },
        { type: "Candidate", id: "LIST" },
        ...(candidateId ? [{ type: "Candidate" as const, id: candidateId }] : []),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOfferMutation,
  useConvertCandidateToEmployeeMutation,
  useGetOffersQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} = offersApi;