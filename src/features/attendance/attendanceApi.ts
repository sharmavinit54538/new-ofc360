import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  AttendanceRecord,
  AttendanceTodayState,
  AttendanceHistoryResponse,
  FacePunchRequest,
  HistoryQueryParams,
  CompanyHistoryQueryParams,
  AttendanceAnalyticsSummary,
  AiAttendanceDashboard,
  AttendanceTrendQueryParams,
  AttendanceTrendData,
  LateArrivalsData,
  AttendanceAnomaliesData,
  AbsencePatternData,
  OvertimeData,
  ShiftViolationsData,
  AttendanceHealthScore,
  AbsenteeWatchlist,
} from "./types";

/**
 * Helper to build FormData if argument is a plain FacePunchRequest object
 */
function toFormData(body: FormData | FacePunchRequest): FormData {
  if (body instanceof FormData) {
    return body;
  }
  const formData = new FormData();
  if (body.file) {
    formData.append("file", body.file);
  }
  if (body.latitude !== undefined && body.latitude !== null) {
    formData.append("latitude", String(body.latitude));
  }
  if (body.longitude !== undefined && body.longitude !== null) {
    formData.append("longitude", String(body.longitude));
  }
  if (body.device_info) {
    formData.append("device_info", body.device_info);
  }
  if (body.ip_address) {
    formData.append("ip_address", body.ip_address);
  }
  return formData;
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. checkIn — POST /api/v1/attendance/face/check-in
    checkIn: builder.mutation<APIResponse<AttendanceRecord>, FormData | FacePunchRequest>({
      query: (body) => ({
        url: "/api/v1/attendance/face/check-in",
        method: "POST",
        body: toFormData(body),
      }),
      invalidatesTags: [
        { type: "Attendance", id: "ME" },
        { type: "Attendance", id: "TODAY" },
        { type: "Attendance", id: "ME_HISTORY" },
        { type: "Attendance", id: "TEAM" },
        { type: "Attendance", id: "COMPANY" },
        "Attendance",
        "AttendanceAnalytics",
      ],
    }),

    // 2. checkOut — POST /api/v1/attendance/face/check-out
    checkOut: builder.mutation<APIResponse<AttendanceRecord>, FormData | FacePunchRequest>({
      query: (body) => ({
        url: "/api/v1/attendance/face/check-out",
        method: "POST",
        body: toFormData(body),
      }),
      invalidatesTags: [
        { type: "Attendance", id: "ME" },
        { type: "Attendance", id: "TODAY" },
        { type: "Attendance", id: "ME_HISTORY" },
        { type: "Attendance", id: "TEAM" },
        { type: "Attendance", id: "COMPANY" },
        "Attendance",
        "AttendanceAnalytics",
      ],
    }),

    // 3. getTodayStatus — GET /api/v1/attendance/face/me
    getTodayStatus: builder.query<APIResponse<AttendanceTodayState>, void>({
      query: () => "/api/v1/attendance/face/me",
      providesTags: [{ type: "Attendance", id: "TODAY" }],
    }),

    // 4. getMyHistory — GET /api/v1/attendance/face/history
    getMyHistory: builder.query<APIResponse<AttendanceHistoryResponse>, HistoryQueryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        qp.append("page", String(params?.page ?? 1));
        qp.append("limit", String(params?.limit ?? 20));
        const qs = qp.toString();
        return `/api/v1/attendance/face/history${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "Attendance", id: "ME_HISTORY" }],
    }),

    // 5. getTeamHistory — GET /api/v1/attendance/face/team (role: admin/manager)
    getTeamHistory: builder.query<APIResponse<AttendanceHistoryResponse>, HistoryQueryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.append("page", String(params.page));
        if (params?.limit) qp.append("limit", String(params.limit));
        const qs = qp.toString();
        return `/api/v1/attendance/face/team${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "Attendance", id: "TEAM" }],
    }),

    // 6. getCompanyHistory — GET /api/v1/attendance/face/company (role: admin)
    getCompanyHistory: builder.query<APIResponse<AttendanceHistoryResponse>, CompanyHistoryQueryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.branch) qp.append("branch", params.branch);
        if (params?.department) qp.append("department", params.department);
        if (params?.page) qp.append("page", String(params.page));
        if (params?.limit) qp.append("limit", String(params.limit));
        const qs = qp.toString();
        return `/api/v1/attendance/face/company${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "Attendance", id: "COMPANY" }],
    }),

    // 7. getAttendanceAnalytics — GET /api/v1/attendance/face/analytics (role: admin/manager)
    getAttendanceAnalytics: builder.query<APIResponse<AttendanceAnalyticsSummary>, void>({
      query: () => "/api/v1/attendance/face/analytics",
      providesTags: ["AttendanceAnalytics"],
    }),

    // 8. getAiDashboard — GET /api/v1/ai/attendance/dashboard
    getAiDashboard: builder.query<APIResponse<AiAttendanceDashboard>, void>({
      query: () => "/api/v1/ai/attendance/dashboard",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "DASHBOARD" }],
    }),

    // 9. getAttendanceTrend — GET /api/v1/ai/attendance/trend
    getAttendanceTrend: builder.query<APIResponse<AttendanceTrendData>, AttendanceTrendQueryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        qp.append("group_by", params?.group_by ?? "daily");
        return `/api/v1/ai/attendance/trend?${qp.toString()}`;
      },
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "TREND" }],
    }),

    // 10. getLateArrivals — GET /api/v1/ai/attendance/late-arrivals
    getLateArrivals: builder.query<APIResponse<LateArrivalsData>, void>({
      query: () => "/api/v1/ai/attendance/late-arrivals",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "LATE_ARRIVALS" }],
    }),

    // 11. getAnomalies — GET /api/v1/ai/attendance/anomalies
    getAnomalies: builder.query<APIResponse<AttendanceAnomaliesData>, void>({
      query: () => "/api/v1/ai/attendance/anomalies",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "ANOMALIES" }],
    }),

    // 12. getAbsencePatterns — GET /api/v1/ai/attendance/absence-pattern
    getAbsencePatterns: builder.query<APIResponse<AbsencePatternData>, void>({
      query: () => "/api/v1/ai/attendance/absence-pattern",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "ABSENCE_PATTERNS" }],
    }),

    // 13. getOvertime — GET /api/v1/ai/attendance/overtime
    getOvertime: builder.query<APIResponse<OvertimeData>, void>({
      query: () => "/api/v1/ai/attendance/overtime",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "OVERTIME" }],
    }),

    // 14. getShiftViolations — GET /api/v1/ai/attendance/shift-violations
    getShiftViolations: builder.query<APIResponse<ShiftViolationsData>, void>({
      query: () => "/api/v1/ai/attendance/shift-violations",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "SHIFT_VIOLATIONS" }],
    }),

    // 15. getHealthScore — GET /api/v1/ai/attendance/health-score
    getHealthScore: builder.query<APIResponse<AttendanceHealthScore>, void>({
      query: () => "/api/v1/ai/attendance/health-score",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "HEALTH_SCORE" }],
    }),

    // 16. getWatchlist — GET /api/v1/ai/attendance/watchlist
    getWatchlist: builder.query<APIResponse<AbsenteeWatchlist>, void>({
      query: () => "/api/v1/ai/attendance/watchlist",
      providesTags: ["AttendanceAnalytics", { type: "AttendanceAnalytics", id: "WATCHLIST" }],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayStatusQuery,
  useGetMyHistoryQuery,
  useGetTeamHistoryQuery,
  useGetCompanyHistoryQuery,
  useGetAttendanceAnalyticsQuery,
  useGetAiDashboardQuery,
  useGetAttendanceTrendQuery,
  useGetLateArrivalsQuery,
  useGetAnomaliesQuery,
  useGetAbsencePatternsQuery,
  useGetOvertimeQuery,
  useGetShiftViolationsQuery,
  useGetHealthScoreQuery,
  useGetWatchlistQuery,
} = attendanceApi;