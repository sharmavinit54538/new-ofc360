import { baseApi } from "../baseApi";
import type { RankingResult, TopRankedResponse, RankCandidatesRequest, TopRankedQueryParams } from "@/types/ranking";
import type { APIResponse } from "./recruitmentCandidateTypes";

export const recruitmentRankingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rankCandidates: builder.mutation<RankingResult, RankCandidatesRequest>({
      query: (body) => ({ url: "/api/v2/ranking/rank", method: "POST", body }),
      transformResponse: (response: APIResponse<RankingResult>) => response.data,
      invalidatesTags: ["Candidate", "Recruitment"],
    }),
    getTopRankedCandidates: builder.query<TopRankedResponse, TopRankedQueryParams>({
      query: ({ job_id, top_n }) => `/api/v2/ranking/top/${job_id}?top_n=${top_n ?? 10}`,
      transformResponse: (response: APIResponse<TopRankedResponse>) => response.data,
      providesTags: ["Candidate"],
    }),
  }),
});
export const { useRankCandidatesMutation, useGetTopRankedCandidatesQuery } = recruitmentRankingApi;
