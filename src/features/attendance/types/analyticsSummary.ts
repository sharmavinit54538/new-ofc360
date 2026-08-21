export interface AttendanceAnalyticsSummary {
  present_count?: number;
  absent_count?: number;
  late_count?: number;
  total_employees?: number;
  attendance_rate?: number;
  [key: string]: unknown;
}
