import { baseApi } from "@/services/api/baseApi";
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
        url: "/v2/reports",
        method: "GET",
        params: {
          type: params?.type,
          status: params?.status,
          search: params?.search,
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
        },
      }),
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
        url: "/v2/reports/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "STATS" }],
    }),

    createReport: builder.mutation<APIResponse<ReportResponse>, ReportCreate>({
      query: (body) => ({
        url: "/v2/reports",
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
        url: `/v2/reports/${id}/refresh`,
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
        url: `/v2/reports/${id}`,
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
        url: "/v2/reports/analytics/headcount",
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "HEADCOUNT_ANALYTICS" }],
    }),

    getDepartmentAnalytics: builder.query<APIResponse<DepartmentAnalytics[]>, void>({
      query: () => ({
        url: "/v2/reports/analytics/department",
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "DEPARTMENT_ANALYTICS" }],
    }),

    getTenureAnalytics: builder.query<APIResponse<TenureAnalytics[]>, void>({
      query: () => ({
        url: "/v2/reports/analytics/tenure",
        method: "GET",
      }),
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
