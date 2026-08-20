import { baseApi } from "@/services/api/baseApi";
import { RawEnvelope } from "@/services/api/envelope";
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
import { extractData, extractArray } from "./unwrapHelper";

export const performanceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceDashboard: builder.query<APIResponse<PerformanceDashboardKpis>, void>({
      query: () => ({
        url: "/api/v1/ai/performance/dashboard",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<PerformanceDashboardKpis> | APIResponse<PerformanceDashboardKpis> | PerformanceDashboardKpis) => {
        const data = extractData<PerformanceDashboardKpis>(raw);
        return {
          success: true,
          message: "Performance dashboard data retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "DASHBOARD" }],
    }),

    getPerformanceTrends: builder.query<APIResponse<PerformanceTrend[]>, void>({
      query: () => ({
        url: "/api/v1/ai/performance/trends",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<PerformanceTrend[]> | APIResponse<PerformanceTrend[]> | PerformanceTrend[]) => {
        const data = extractArray<PerformanceTrend>(raw);
        return {
          success: true,
          message: "Performance trends retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "TRENDS" }],
    }),

    getKpiAttainment: builder.query<APIResponse<KpiAttainment[]>, void>({
      query: () => ({
        url: "/api/v1/ai/performance/kpi-attainment",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<KpiAttainment[]> | APIResponse<KpiAttainment[]> | KpiAttainment[]) => {
        const data = extractArray<KpiAttainment>(raw);
        return {
          success: true,
          message: "KPI attainment data retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "KPI_ATTAINMENT" }],
    }),

    getTopPerformers: builder.query<APIResponse<TopPerformer[]>, void>({
      query: () => ({
        url: "/api/v1/ai/performance/top-performers",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<TopPerformer[]> | APIResponse<TopPerformer[]> | TopPerformer[]) => {
        const data = extractArray<TopPerformer>(raw);
        return {
          success: true,
          message: "Top performers retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "TOP_PERFORMERS" }],
    }),

    getEmployeePerformanceScore: builder.query<
      APIResponse<EmployeePerformanceScore>,
      string
    >({
      query: (employeeId) => ({
        url: `/api/v1/ai/performance/employee/${employeeId}`,
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EmployeePerformanceScore> | APIResponse<EmployeePerformanceScore> | EmployeePerformanceScore) => {
        const data = extractData<EmployeePerformanceScore>(raw);
        return {
          success: true,
          message: "Employee performance score retrieved",
          data,
          errors: null,
        };
      },
      providesTags: (_res, _err, employeeId) => [
        { type: "PerformanceReport", id: `EMPLOYEE_${employeeId}` },
      ],
    }),

    getSkillGaps: builder.query<APIResponse<SkillGap[]>, void>({
      query: () => ({
        url: "/api/v1/ai/performance/skill-gaps",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<SkillGap[]> | APIResponse<SkillGap[]> | SkillGap[]) => {
        const data = extractArray<SkillGap>(raw);
        return {
          success: true,
          message: "Skill gaps retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "SKILL_GAPS" }],
    }),

    getPromotionRecommendations: builder.query<
      APIResponse<PromotionRecommendation[]>,
      void
    >({
      query: () => ({
        url: "/api/v1/ai/performance/promotion-recommendations",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<PromotionRecommendation[]> | APIResponse<PromotionRecommendation[]> | PromotionRecommendation[]) => {
        const data = extractArray<PromotionRecommendation>(raw);
        return {
          success: true,
          message: "Promotion recommendations retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "PROMOTIONS" }],
    }),

    getCoachingSuggestions: builder.query<
      APIResponse<CoachingSuggestion[]>,
      void
    >({
      query: () => ({
        url: "/api/v1/ai/performance/coaching-suggestions",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CoachingSuggestion[]> | APIResponse<CoachingSuggestion[]> | CoachingSuggestion[]) => {
        const data = extractArray<CoachingSuggestion>(raw);
        return {
          success: true,
          message: "Coaching suggestions retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "COACHING" }],
    }),

    getPerformanceAnalytics: builder.query<
      APIResponse<PerformanceAnalytics>,
      void
    >({
      query: () => ({
        url: "/api/v1/ai/performance/analytics",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<PerformanceAnalytics> | APIResponse<PerformanceAnalytics> | PerformanceAnalytics) => {
        const data = extractData<PerformanceAnalytics>(raw);
        return {
          success: true,
          message: "Performance analytics retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "PerformanceReport", id: "ANALYTICS" }],
    }),

    evaluatePerformance: builder.mutation<APIResponse<unknown>, EvaluateReviewPayload>({
      query: (body) => ({
        url: "/api/v1/ai/performance/evaluate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "DASHBOARD" }],
    }),

    generateCoaching: builder.mutation<APIResponse<CoachingSuggestion[]>, GenerateCoachingPayload>({
      query: (body) => ({
        url: "/api/v1/ai/performance/generate-coaching",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "COACHING" }],
    }),

    generatePromotion: builder.mutation<APIResponse<PromotionRecommendation[]>, GeneratePromotionPayload>({
      query: (body) => ({
        url: "/api/v1/ai/performance/generate-promotion",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceReport", id: "PROMOTIONS" }],
    }),

    skillGapAnalysis: builder.mutation<APIResponse<SkillGap[]>, SkillGapAnalysisPayload>({
      query: (body) => ({
        url: "/api/v1/ai/performance/skill-gap-analysis",
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
