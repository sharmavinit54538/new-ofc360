import { api } from "@/api/client";
import type { AttendanceRecord, ClockInInput } from "@/services/api/attendance/attendanceTypes";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "half_day" | "late" | "on_leave";
  location?: string;
  verificationMethod?: "gps" | "face_id" | "wifi" | "manual";
}

export interface ClockInInput {
  employeeId: string;
  location?: string;
  verificationMethod?: string;
  coordinates?: { lat: number; lng: number };
}

export interface FacePunchRequest {
  employeeId: string;
  image: File;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

export interface AttendanceStats {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  onLeaveCount: number;
}

export interface AttendanceSummary {
  date: string;
  stats: AttendanceStats;
  records: AttendanceRecord[];
}

export const attendanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRecords: builder.query<AttendanceRecord[], { employeeId?: string; date?: string }>({
      query: (p) => `/api/v1/attendance?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Attendance"],
    }),

    getAttendanceSummary: builder.query<AttendanceSummary, { date?: string }>({
      query: (p) => `/api/v1/attendance/summary?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    getAttendanceStats: builder.query<AttendanceStats, { date?: string }>({
      query: (p) => `/api/v1/attendance/stats?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["AttendanceAnalytics"],
    }),

    clockIn: builder.mutation<AttendanceRecord, ClockInInput>({
      query: (body) => ({ url: "/api/v1/attendance/clock-in", method: "POST", body }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    clockOut: builder.mutation<AttendanceRecord, { attendanceId: string }>({
      query: ({ attendanceId }) => ({ url: `/api/v1/attendance/${attendanceId}/clock-out`, method: "POST" }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    faceCheckIn: builder.mutation<AttendanceRecord, FormData>({
      query: (formData) => ({ url: "/api/v1/attendance/face/check-in", method: "POST", body: formData }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    faceCheckOut: builder.mutation<AttendanceRecord, FormData>({
      query: (formData) => ({ url: "/api/v1/attendance/face/check-out", method: "POST", body: formData }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    getMyAttendance: builder.query<AttendanceRecord[], { date?: string }>({
      query: (p) => `/api/v1/attendance/my?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Attendance"],
    }),

    getTeamAttendance: builder.query<AttendanceRecord[], { date?: string; teamId?: string }>({
      query: (p) => `/api/v1/attendance/team?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Attendance"],
    }),

    getAttendanceStatus: builder.query<{ status: string; record?: AttendanceRecord }, void>({
      query: () => '/api/v1/attendance/status',
      providesTags: [{ type: 'Attendance', id: 'STATUS' }],
    }),

    regularizeAttendance: builder.mutation<AttendanceRecord, { date: string; checkIn?: string; checkOut?: string; reason: string }>({
      query: (body) => ({ url: "/api/v1/attendance/regularize", method: "POST", body }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    approveRegularization: builder.mutation<AttendanceRecord, { id: string }>({
      query: ({ id }) => ({ url: `/api/v1/attendance/regularize/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),

    rejectRegularization: builder.mutation<AttendanceRecord, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/api/v1/attendance/regularize/${id}/reject`, method: "POST", body: { reason } }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),
  }),
});

export const {
  useGetAttendanceRecordsQuery,
  useGetAttendanceSummaryQuery,
  useGetAttendanceStatsQuery,
  useClockInMutation,
  useClockOutMutation,
  useFaceCheckInMutation,
  useFaceCheckOutMutation,
  useGetMyAttendanceQuery,
  useGetTeamAttendanceQuery,
  useGetAttendanceStatusQuery,
  useRegularizeAttendanceMutation,
  useApproveRegularizationMutation,
  useRejectRegularizationMutation,
} = attendanceApi;

export type {
  AttendanceRecord,
  ClockInInput,
  FacePunchRequest,
  AttendanceStats,
  AttendanceSummary,
};