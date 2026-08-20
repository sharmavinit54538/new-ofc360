import { baseApi } from "./baseApi";

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

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRecords: builder.query<AttendanceRecord[], { employeeId?: string; date?: string }>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.employeeId) search.append("employeeId", params.employeeId);
        if (params?.date) search.append("date", params.date);
        const q = search.toString();
        return `/api/v1/attendance${q ? `?${q}` : ""}`;
      },
      providesTags: ["Attendance"],
    }),

    clockIn: builder.mutation<AttendanceRecord, ClockInInput>({
      query: (body) => ({
        url: "/api/v1/attendance/clock-in",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    clockOut: builder.mutation<AttendanceRecord, { attendanceId: string }>({
      query: ({ attendanceId }) => ({
        url: `/api/v1/attendance/${attendanceId}/clock-out`,
        method: "POST",
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendanceRecordsQuery,
  useClockInMutation,
  useClockOutMutation,
} = attendanceApi;