import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceTrendData, AttendanceTrendQueryParams, LateArrivalsData, AttendanceAnomaliesData } from "../types";

export const aiInsightsApiPart1 = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceTrend: builder.query<APIResponse<AttendanceTrendData>, AttendanceTrendQueryParams | void>({
      query: (p) => `/api/v1/ai/attendance/trend?group_by=${p?.group_by ?? "daily"}`,
      providesTags: ["AttendanceAnalytics"],
    }),
    getLateArrivals: builder.query<APIResponse<LateArrivalsData>, void>({
      query: () => "/api/v1/ai/attendance/late-arrivals",
      providesTags: ["AttendanceAnalytics"],
    }),
    getAnomalies: builder.query<APIResponse<AttendanceAnomaliesData>, void>({
      query: () => "/api/v1/ai/attendance/anomalies",
      providesTags: ["AttendanceAnalytics"],
    }),
  }),
});
export const { useGetAttendanceTrendQuery, useGetLateArrivalsQuery, useGetAnomaliesQuery } = aiInsightsApiPart1;
