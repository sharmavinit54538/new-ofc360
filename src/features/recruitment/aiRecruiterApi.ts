import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  AiDashboardKpis,
  FunnelData,
  MatchDistribution,
  CandidateScore,
  AiRecommendation,
  QuestionGenInput,
  QuestionGenOutput,
  RecruitmentFunnelAnalytics,
} from "./types";

export const aiRecruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiDashboardKpis: builder.query<APIResponse<AiDashboardKpis>, void>({
      query: () => "/api/v1/ai/recruiter/dashboard",
      providesTags: [{ type: "AiRecruiter", id: "DASHBOARD" }],
    }),

    getFunnelData: builder.query<APIResponse<FunnelData[]>, void>({
      query: () => "/api/v1/ai/recruiter/funnel",
      providesTags: [{ type: "AiRecruiter", id: "FUNNEL" }],
    }),

    getMatchDistribution: builder.query<
      APIResponse<MatchDistribution[]>,
      void
    >({
      query: () => "/api/v1/ai/recruiter/match-distribution",
      providesTags: [{ type: "AiRecruiter", id: "MATCH_DIST" }],
    }),

    getAiRecruitmentAnalytics: builder.query<
      APIResponse<RecruitmentFunnelAnalytics>,
      void
    >({
      query: () => "/api/v1/ai/recruiter/analytics",
      providesTags: [{ type: "AiRecruiter", id: "ANALYTICS" }],
    }),

    getCandidateScore: builder.query<APIResponse<CandidateScore>, string>({
      query: (candidateId) =>
        `/api/v1/ai/recruiter/candidate/${candidateId}/score`,
      providesTags: (_res, _err, candidateId) => [
        { type: "AiRecruiter", id: `SCORE_${candidateId}` },
      ],
    }),

    getCandidateRecommendation: builder.query<
      APIResponse<AiRecommendation>,
      string
    >({
      query: (candidateId) =>
        `/api/v1/ai/recruiter/candidate/${candidateId}/recommendation`,
      providesTags: (_res, _err, candidateId) => [
        { type: "AiRecruiter", id: `REC_${candidateId}` },
      ],
    }),

    analyzeResume: builder.mutation<
      APIResponse<{ skills: string[]; summary: string; experience_years: number }>,
      FormData
    >({
      query: (formData) => ({
        url: "/api/v1/ai/recruiter/resume/analyze",
        method: "POST",
        body: formData,
      }),
    }),

    semanticMatch: builder.mutation<
      APIResponse<{ match_score: number; breakdown: Record<string, number> }>,
      { candidateId: string; jobId: string }
    >({
      query: (body) => ({
        url: "/api/v1/ai/recruiter/match",
        method: "POST",
        body,
      }),
    }),

    rankCandidatesForJob: builder.mutation<
      APIResponse<{ candidate_id: string; rank: number; score: number }[]>,
      { jobId: string }
    >({
      query: (body) => ({
        url: "/api/v1/ai/recruiter/rank",
        method: "POST",
        body,
      }),
    }),

    generateInterviewQuestions: builder.mutation<
      APIResponse<QuestionGenOutput>,
      QuestionGenInput
    >({
      query: (body) => ({
        url: "/api/v1/ai/recruiter/interview/questions",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiDashboardKpisQuery,
  useGetFunnelDataQuery,
  useGetMatchDistributionQuery,
  useGetAiRecruitmentAnalyticsQuery,
  useGetCandidateScoreQuery,
  useGetCandidateRecommendationQuery,
  useAnalyzeResumeMutation,
  useSemanticMatchMutation,
  useRankCandidatesForJobMutation,
  useGenerateInterviewQuestionsMutation,
} = aiRecruiterApi;
