import { attendanceApi } from "./attendance/attendanceEndpoints";

export * from "./attendance/attendanceTypes";
export * from "./attendance/attendanceEndpoints";

export const {
  useGetAttendanceRecordsQuery,
  useClockInMutation,
  useClockOutMutation,
} = attendanceApi;