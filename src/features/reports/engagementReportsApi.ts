import { baseApi } from "@/services/api/baseApi";
import { RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  EngagementSummary,
  EngagementTrendItem,
  EnpsTrendItem,
  EngagementBreakdownItem,
  EngagementSurveyItem,
} from "./types";
import { extractData, extractArray } from "./unwrapHelper";

export const engagementReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEngagementSummary: builder.query<APIResponse<EngagementSummary>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/summary",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EngagementSummary> | APIResponse<EngagementSummary> | EngagementSummary) => {
        const data = extractData<EngagementSummary>(raw);
        return {
          success: true,
          message: "Engagement summary retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "EngagementReport", id: "SUMMARY" }],
    }),

    getEngagementTrend: builder.query<APIResponse<EngagementTrendItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/trend",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EngagementTrendItem[]> | APIResponse<EngagementTrendItem[]> | EngagementTrendItem[]) => {
        const data = extractArray<EngagementTrendItem>(raw);
        return {
          success: true,
          message: "Engagement trend retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "EngagementReport", id: "TREND" }],
    }),

    getEnpsTrend: builder.query<APIResponse<EnpsTrendItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/enps-trend",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EnpsTrendItem[]> | APIResponse<EnpsTrendItem[]> | EnpsTrendItem[]) => {
        const data = extractArray<EnpsTrendItem>(raw);
        return {
          success: true,
          message: "eNPS trend retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "EngagementReport", id: "ENPS_TREND" }],
    }),

    getEngagementBreakdown: builder.query<APIResponse<EngagementBreakdownItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/breakdown",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EngagementBreakdownItem[]> | APIResponse<EngagementBreakdownItem[]> | EngagementBreakdownItem[]) => {
        const data = extractArray<EngagementBreakdownItem>(raw);
        return {
          success: true,
          message: "Engagement breakdown retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "EngagementReport", id: "BREAKDOWN" }],
    }),

    getEngagementSurveys: builder.query<APIResponse<EngagementSurveyItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/surveys",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EngagementSurveyItem[]> | APIResponse<EngagementSurveyItem[]> | EngagementSurveyItem[]) => {
        const data = extractArray<EngagementSurveyItem>(raw);
        return {
          success: true,
          message: "Engagement surveys retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "EngagementReport", id: "SURVEYS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEngagementSummaryQuery,
  useGetEngagementTrendQuery,
  useGetEnpsTrendQuery,
  useGetEngagementBreakdownQuery,
  useGetEngagementSurveysQuery,
} = engagementReportsApi;
