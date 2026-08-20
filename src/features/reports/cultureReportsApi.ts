import { baseApi } from "@/services/api/baseApi";
import { RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  CultureDiTelemetry,
  CultureTrendItem,
  CultureBreakdownItem,
  CultureFeedbackItem,
} from "./types";
import { extractData, extractArray } from "./unwrapHelper";

export const cultureReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCultureTelemetry: builder.query<APIResponse<CultureDiTelemetry>, void>({
      query: () => ({
        url: "/api/v1/reports/culture/telemetry",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CultureDiTelemetry> | APIResponse<CultureDiTelemetry> | CultureDiTelemetry) => {
        const data = extractData<CultureDiTelemetry>(raw);
        return {
          success: true,
          message: "Culture & D&I Telemetry retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "CultureReport", id: "TELEMETRY" }],
    }),

    getCultureTrend: builder.query<APIResponse<CultureTrendItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/culture/trend",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CultureTrendItem[]> | APIResponse<CultureTrendItem[]> | CultureTrendItem[]) => {
        const data = extractArray<CultureTrendItem>(raw);
        return {
          success: true,
          message: "Culture trend retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "CultureReport", id: "TREND" }],
    }),

    getCultureBreakdown: builder.query<APIResponse<CultureBreakdownItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/culture/breakdown",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CultureBreakdownItem[]> | APIResponse<CultureBreakdownItem[]> | CultureBreakdownItem[]) => {
        const data = extractArray<CultureBreakdownItem>(raw);
        return {
          success: true,
          message: "Culture breakdown retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "CultureReport", id: "BREAKDOWN" }],
    }),

    getCultureFeedback: builder.query<APIResponse<CultureFeedbackItem[]>, void>({
      query: () => ({
        url: "/api/v1/reports/culture/feedback",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CultureFeedbackItem[]> | APIResponse<CultureFeedbackItem[]> | CultureFeedbackItem[]) => {
        const data = extractArray<CultureFeedbackItem>(raw);
        return {
          success: true,
          message: "Culture feedback retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "CultureReport", id: "FEEDBACK" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCultureTelemetryQuery,
  useGetCultureTrendQuery,
  useGetCultureBreakdownQuery,
  useGetCultureFeedbackQuery,
} = cultureReportsApi;
