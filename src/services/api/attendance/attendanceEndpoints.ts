import { baseApi } from "../baseApi";
import type { AttendanceRecord, ClockInInput } from "./attendanceTypes";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRecords: builder.query<AttendanceRecord[], { employeeId?: string; date?: string }>({
      query: (p) => `/api/v1/attendance?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Attendance"],
    }),
    clockIn: builder.mutation<AttendanceRecord, ClockInInput>({
      query: (body) => ({ url: "/api/v1/attendance/clock-in", method: "POST", body }),
      invalidatesTags: ["Attendance"],
    }),
    clockOut: builder.mutation<AttendanceRecord, { attendanceId: string }>({
      query: ({ attendanceId }) => ({ url: `/api/v1/attendance/${attendanceId}/clock-out`, method: "POST" }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});
