import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  ScorecardTemplate,
  ScorecardTemplateInput,
  ScorecardSubmission,
  ScorecardSubmissionInput,
} from "./types";

export const scorecardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScorecardTemplates: builder.query<
      APIResponse<ScorecardTemplate[]>,
      void
    >({
      query: () => "/api/v1/scorecards/templates",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Scorecard" as const,
                id,
              })),
              { type: "Scorecard", id: "TEMPLATE_LIST" },
            ]
          : [{ type: "Scorecard", id: "TEMPLATE_LIST" }],
    }),

    createScorecardTemplate: builder.mutation<
      APIResponse<ScorecardTemplate>,
      ScorecardTemplateInput
    >({
      query: (body) => ({
        url: "/api/v1/scorecards/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Scorecard", id: "TEMPLATE_LIST" }],
    }),

    getScorecardsForRound: builder.query<
      APIResponse<ScorecardSubmission[]>,
      string
    >({
      query: (roundId) => `/api/v1/scorecards/submissions/${roundId}`,
      providesTags: (_res, _err, roundId) => [
        { type: "Scorecard", id: `ROUND_${roundId}` },
      ],
    }),

    submitScorecard: builder.mutation<
      APIResponse<ScorecardSubmission>,
      ScorecardSubmissionInput
    >({
      query: (body) => ({
        url: "/api/v1/scorecards/submissions",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { roundId, candidateId }) => [
        { type: "Scorecard", id: `ROUND_${roundId}` },
        { type: "Candidate", id: candidateId },
        { type: "Candidate", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetScorecardTemplatesQuery,
  useCreateScorecardTemplateMutation,
  useGetScorecardsForRoundQuery,
  useSubmitScorecardMutation,
} = scorecardsApi;
