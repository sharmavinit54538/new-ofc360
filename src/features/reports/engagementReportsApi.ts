import { baseApi } from "@/services/api/baseApi";
import { unwrapEnvelope, RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  EngagementSummary,
  EngagementTrendItem,
  EnpsTrendItem,
  EngagementBreakdownItem,
  EngagementSurveyItem,
} from "./types";

export const engagementReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEngagementSummary: builder.query<APIResponse<EngagementSummary>, void>({
      query: () => ({
        url: "/api/v1/reports/engagement/summary",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EngagementSummary> | APIResponse<EngagementSummary> | EngagementSummary) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EngagementSummary>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Engagement summary retrieved",
          data: (data && typeof data === "object") ? data as EngagementSummary : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EngagementTrendItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Engagement trend retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EnpsTrendItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "eNPS trend retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EngagementBreakdownItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Engagement breakdown retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EngagementSurveyItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Engagement surveys retrieved",
          data: Array.isArray(data) ? data : [],
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
