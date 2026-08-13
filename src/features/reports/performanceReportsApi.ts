import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  PerformanceDashboardKpis,
  PerformanceTrend,
  KpiAttainment,
  TopPerformer,
  EmployeePerformanceScore,
  SkillGap,
  PromotionRecommendation,
  CoachingSuggestion,
  PerformanceAnalytics,
  EvaluateReviewPayload,
  GenerateCoachingPayload,
  GeneratePromotionPayload,
  SkillGapAnalysisPayload,
} from "./types";

export const performanceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceDashboard: builder.query<APIResponse<PerformanceDashboardKpis>, void>({
      query: () => ({
        url: "/v1/ai/performance/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "DASHBOARD" }],
    }),

    getPerformanceTrends: builder.query<APIResponse<PerformanceTrend[]>, void>({
      query: () => ({
        url: "/v1/ai/performance/trends",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "TRENDS" }],
    }),

    getKpiAttainment: builder.query<APIResponse<KpiAttainment[]>, void>({
      query: () => ({
        url: "/v1/ai/performance/kpi-attainment",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "KPI_ATTAINMENT" }],
    }),

    getTopPerformers: builder.query<APIResponse<TopPerformer[]>, void>({
      query: () => ({
        url: "/v1/ai/performance/top-performers",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "TOP_PERFORMERS" }],
    }),

    getEmployeePerformanceScore: builder.query<
      APIResponse<EmployeePerformanceScore>,
      string
    >({
      query: (employeeId) => ({
        url: `/v1/ai/performance/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, employeeId) => [
        { type: "PerformanceReport", id: `EMPLOYEE_${employeeId}` },
      ],
    }),

    getSkillGaps: builder.query<APIResponse<SkillGap[]>, void>({
      query: () => ({
        url: "/v1/ai/performance/skill-gaps",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "SKILL_GAPS" }],
    }),

    getPromotionRecommendations: builder.query<
      APIResponse<PromotionRecommendation[]>,
      void
    >({
      query: () => ({
        url: "/v1/ai/performance/promotion-recommendations",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "PROMOTIONS" }],
    }),

    getCoachingSuggestions: builder.query<
      APIResponse<CoachingSuggestion[]>,
      void
    >({
      query: () => ({
        url: "/v1/ai/performance/coaching-suggestions",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "COACHING" }],
    }),

    getPerformanceAnalytics: builder.query<
      APIResponse<PerformanceAnalytics>,
      void
    >({
      query: () => ({
        url: "/v1/ai/performance/analytics",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReport", id: "ANALYTICS" }],
    }),

    evaluatePerformance: builder.mutation<APIResponse<any>, EvaluateReviewPayload>({
      query: (body) => ({
        url: "/v1/ai/performance/evaluate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "DASHBOARD" }],
    }),

    generateCoaching: builder.mutation<APIResponse<CoachingSuggestion[]>, GenerateCoachingPayload>({
      query: (body) => ({
        url: "/v1/ai/performance/generate-coaching",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "COACHING" }],
    }),

    generatePromotion: builder.mutation<APIResponse<PromotionRecommendation[]>, GeneratePromotionPayload>({
      query: (body) => ({
        url: "/v1/ai/performance/generate-promotion",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "PROMOTIONS" }],
    }),

    skillGapAnalysis: builder.mutation<APIResponse<SkillGap[]>, SkillGapAnalysisPayload>({
      query: (body) => ({
        url: "/v1/ai/performance/skill-gap-analysis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "SKILL_GAPS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPerformanceDashboardQuery,
  useGetPerformanceTrendsQuery,
  useGetKpiAttainmentQuery,
  useGetTopPerformersQuery,
  useGetEmployeePerformanceScoreQuery,
  useGetSkillGapsQuery,
  useGetPromotionRecommendationsQuery,
  useGetCoachingSuggestionsQuery,
  useGetPerformanceAnalyticsQuery,
  useEvaluatePerformanceMutation,
  useGenerateCoachingMutation,
  useGeneratePromotionMutation,
  useSkillGapAnalysisMutation,
} = performanceReportsApi;
