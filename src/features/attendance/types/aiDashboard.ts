export interface AiAttendanceDashboard {
  overall_health_score?: number;
  present_today?: number;
  absent_today?: number;
  late_today?: number;
  anomalies_detected?: number;
  recent_anomalies?: Array<Record<string, unknown>>;
  department_summary?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}
