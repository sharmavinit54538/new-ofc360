import { baseApi } from "../baseApi";
import type { FaceAttendanceRecord, PaginatedAttendanceResponse } from "./faceAttendanceTypes";
import type { GetFaceHistoryParams, GetTeamAttendanceParams, GetCompanyAttendanceParams, FaceAttendanceAnalyticsResponse } from "./faceAttendanceParamsTypes";
import { normalizeRecord, normalizePaginated } from "./normalizeFaceAttendance";

export const faceAttendanceHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalFaceHistory: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetFaceHistoryParams | void>({
      query: (p?: GetFaceHistoryParams) => {
        const qp = new URLSearchParams();
        if (p?.page) qp.append("page", String(p.page)); if (p?.limit) qp.append("limit", String(p.limit));
        if (p?.startDate) qp.append("startDate", p.startDate); if (p?.endDate) qp.append("endDate", p.endDate);
        if (p?.status && p.status !== "all") qp.append("status", p.status); if (p?.month) qp.append("month", p.month);
        const qs = qp.toString(); return `/api/v1/attendance/face/history${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "HISTORY" }],
    }),
    getTeamFaceAttendance: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetTeamAttendanceParams | void>({
      query: (p?: GetTeamAttendanceParams) => {
        const qp = new URLSearchParams();
        if (p?.page) qp.append("page", String(p.page)); if (p?.limit) qp.append("limit", String(p.limit));
        if (p?.search) qp.append("search", p.search); if (p?.date) qp.append("date", p.date);
        if (p?.status && p.status !== "all") qp.append("status", p.status);
        const qs = qp.toString(); return `/api/v1/attendance/face/team${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "TEAM" }],
    }),
    getCompanyFaceAttendance: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetCompanyAttendanceParams | void>({
      query: (p?: GetCompanyAttendanceParams) => {
        const qp = new URLSearchParams();
        if (p?.page) qp.append("page", String(p.page)); if (p?.limit) qp.append("limit", String(p.limit));
        if (p?.search) qp.append("search", p.search); if (p?.department && p.department !== "all") qp.append("department", p.department);
        if (p?.date) qp.append("date", p.date); if (p?.startDate) qp.append("startDate", p.startDate);
        if (p?.endDate) qp.append("endDate", p.endDate); if (p?.status && p.status !== "all") qp.append("status", p.status);
        const qs = qp.toString(); return `/api/v1/attendance/face/company${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "COMPANY" }],
    }),
    getFaceAttendanceAnalytics: builder.query<FaceAttendanceAnalyticsResponse, { date?: string; month?: string; department?: string } | void>({
      query: (p?: { date?: string; month?: string; department?: string }) => {
        const qp = new URLSearchParams();
        if (p?.date) qp.append("date", p.date); if (p?.month) qp.append("month", p.month);
        if (p?.department && p.department !== "all") qp.append("department", p.department);
        const qs = qp.toString(); return `/api/v1/attendance/face/analytics${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): FaceAttendanceAnalyticsResponse => {
        const p = raw?.data !== undefined ? raw.data : raw;
        if (!p || typeof p !== "object") return { totalEmployees: 0, presentToday: 0, absentToday: 0, checkedIn: 0, checkedOut: 0, lateEmployees: 0, attendanceRate: 0, dailyTrend: [], departmentStats: [] };
        return { totalEmployees: p.totalEmployees ?? p.total ?? 0, presentToday: p.presentToday ?? p.present ?? 0, absentToday: p.absentToday ?? p.absent ?? 0, checkedIn: p.checkedIn ?? p.checked_in ?? 0, checkedOut: p.checkedOut ?? p.checked_out ?? 0, lateEmployees: p.lateEmployees ?? p.late ?? 0, attendanceRate: p.attendanceRate ?? p.rate ?? 0, dailyTrend: Array.isArray(p.dailyTrend) ? p.dailyTrend : [], departmentStats: Array.isArray(p.departmentStats) ? p.departmentStats : [], punchDistribution: p.punchDistribution };
      },
      providesTags: [{ type: "Attendance", id: "ANALYTICS" }],
    }),
  }),
});
export const { useGetPersonalFaceHistoryQuery, useGetTeamFaceAttendanceQuery, useGetCompanyFaceAttendanceQuery, useGetFaceAttendanceAnalyticsQuery } = faceAttendanceHistoryApi;
