import { baseApi } from "@/services/api/baseApi";
import { unwrapEnvelope, RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  ReportCreate,
  ReportResponse,
  ReportListQueryParams,
  ReportStats,
  HeadcountAnalytics,
  DepartmentAnalytics,
  TenureAnalytics,
} from "./types";

export const reportsCoreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<APIResponse<ReportResponse[]>, ReportListQueryParams | void>({
      query: (params) => ({
        url: "/api/v2/reports",
        method: "GET",
        params: {
          type: params?.type,
          status: params?.status,
          search: params?.search,
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
        },
      }),
      transformResponse: (raw: RawEnvelope<ReportResponse[]> | APIResponse<ReportResponse[]> | ReportResponse[]) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ReportResponse[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Reports retrieved",
          data: Array.isArray(data) ? data : [],
          errors: null,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Report" as const, id })),
              { type: "Report", id: "LIST" },
            ]
          : [{ type: "Report", id: "LIST" }],
    }),

    getReportStats: builder.query<APIResponse<ReportStats>, void>({
      query: () => ({
        url: "/api/v2/reports/stats",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ReportStats> | APIResponse<ReportStats> | ReportStats) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ReportStats>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Report stats retrieved",
          data: (data && typeof data === "object") ? data as ReportStats : null,
          errors: null,
        };
      },
      providesTags: [{ type: "Report", id: "STATS" }],
    }),

    createReport: builder.mutation<APIResponse<ReportResponse>, ReportCreate>({
      query: (body) => ({
        url: "/api/v2/reports",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Report", id: "LIST" },
        { type: "Report", id: "STATS" },
      ],
    }),

    refreshReport: builder.mutation<APIResponse<ReportResponse>, string>({
      query: (id) => ({
        url: `/api/v2/reports/${id}/refresh`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Report", id },
        { type: "Report", id: "LIST" },
        { type: "Report", id: "STATS" },
      ],
    }),

    deleteReport: builder.mutation<APIResponse<void>, string>({
      query: (id) => ({
        url: `/api/v2/reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Report", id },
        { type: "Report", id: "LIST" },
        { type: "Report", id: "STATS" },
      ],
    }),

    getHeadcountAnalytics: builder.query<APIResponse<HeadcountAnalytics[]>, void>({
      query: () => ({
        url: "/api/v2/reports/analytics/headcount",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<HeadcountAnalytics[]> | APIResponse<HeadcountAnalytics[]> | HeadcountAnalytics[]) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<HeadcountAnalytics[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Headcount analytics retrieved",
          data: Array.isArray(data) ? data : [],
          errors: null,
        };
      },
      providesTags: [{ type: "Report", id: "HEADCOUNT_ANALYTICS" }],
    }),

    getDepartmentAnalytics: builder.query<APIResponse<DepartmentAnalytics[]>, void>({
      query: () => ({
        url: "/api/v2/reports/analytics/department",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<DepartmentAnalytics[]> | APIResponse<DepartmentAnalytics[]> | DepartmentAnalytics[]) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<DepartmentAnalytics[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Department analytics retrieved",
          data: Array.isArray(data) ? data : [],
          errors: null,
        };
      },
      providesTags: [{ type: "Report", id: "DEPARTMENT_ANALYTICS" }],
    }),

    getTenureAnalytics: builder.query<APIResponse<TenureAnalytics[]>, void>({
      query: () => ({
        url: "/api/v2/reports/analytics/tenure",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<TenureAnalytics[]> | APIResponse<TenureAnalytics[]> | TenureAnalytics[]) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<TenureAnalytics[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Tenure analytics retrieved",
          data: Array.isArray(data) ? data : [],
          errors: null,
        };
      },
      providesTags: [{ type: "Report", id: "TENURE_ANALYTICS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportsQuery,
  useGetReportStatsQuery,
  useCreateReportMutation,
  useRefreshReportMutation,
  useDeleteReportMutation,
  useGetHeadcountAnalyticsQuery,
  useGetDepartmentAnalyticsQuery,
  useGetTenureAnalyticsQuery,
} = reportsCoreApi;
