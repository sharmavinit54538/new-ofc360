import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceAnalyticsSummary, AiAttendanceDashboard } from "../types";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceAnalytics: builder.query<APIResponse<AttendanceAnalyticsSummary>, void>({
      query: () => "/api/v1/attendance/face/analytics",
      providesTags: ["AttendanceAnalytics"],
    }),
    getAiDashboard: builder.query<APIResponse<AiAttendanceDashboard>, void>({
      query: () => "/api/v1/ai/attendance/dashboard",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "DASHBOARD" }],
    }),
  }),
});
export const { useGetAttendanceAnalyticsQuery, useGetAiDashboardQuery } = analyticsApi;
