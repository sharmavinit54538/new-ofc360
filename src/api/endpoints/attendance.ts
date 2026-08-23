/**
 * Legacy barrel file — re-exports from the canonical attendance API.
 * New code should import directly from "@/features/attendance/api".
 */
export {
  attendanceApi,
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
} from "@/features/attendance/api";

export type {
  AttendanceRecord,
  ClockInInput,
  FacePunchRequest,
  AttendanceStats,
  AttendanceSummary,
} from "@/features/attendance/api";