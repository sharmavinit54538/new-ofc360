import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SilverMedalistCandidate, TalentPoolTag } from "./types";

export const passiveTalentPoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSilverMedalists: builder.query<
      APIResponse<SilverMedalistCandidate[]>,
      void
    >({
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Passive talent pool candidates retrieved",
            data: [],
            errors: null,
          },
        };
      },
      providesTags: [{ type: "TalentPool", id: "SILVER_MEDALISTS" }],
    }),

    getTalentPoolTags: builder.query<APIResponse<TalentPoolTag[]>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Talent pool tags retrieved",
            data: [],
            errors: null,
          },
        };
      },
      providesTags: [{ type: "TalentPool", id: "TAGS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSilverMedalistsQuery, useGetTalentPoolTagsQuery } =
  passiveTalentPoolApi;