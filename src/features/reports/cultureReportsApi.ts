import { baseApi } from "@/services/api/baseApi";
import { unwrapEnvelope, RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  CultureDiTelemetry,
  CultureTrendItem,
  CultureBreakdownItem,
  CultureFeedbackItem,
} from "./types";

export const cultureReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCultureTelemetry: builder.query<APIResponse<CultureDiTelemetry>, void>({
      query: () => ({
        url: "/api/v1/reports/culture/telemetry",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<CultureDiTelemetry> | APIResponse<CultureDiTelemetry> | CultureDiTelemetry) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<CultureDiTelemetry>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Culture & D&I Telemetry retrieved",
          data: (data && typeof data === "object") ? data as CultureDiTelemetry : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<CultureTrendItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Culture trend retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<CultureBreakdownItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Culture breakdown retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<CultureFeedbackItem[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Culture feedback retrieved",
          data: Array.isArray(data) ? data : [],
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
