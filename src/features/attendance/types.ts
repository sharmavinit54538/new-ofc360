/**
 * Attendance Feature Type Definitions
 * RTK Query & UI State Types for Attendance module
 */

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  company_id?: string;
  date: string; // ISO date
  check_in_time: string; // ISO datetime
  check_out_time?: string;
  face_image_url?: string;
  checkout_image_url?: string;
  latitude?: number;
  longitude?: number;
  device_info?: string;
  ip_address?: string;
  working_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceTodayState {
  checked_in: boolean;
  checked_out: boolean;
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
  message: string;
}

export interface AttendanceHistoryResponse {
  page: number;
  limit: number;
  total: number;
  items: AttendanceRecord[];
}

export interface FacePunchRequest {
  file: File | Blob;
  latitude?: number;
  longitude?: number;
  device_info?: string;
  ip_address?: string;
}

export interface HistoryQueryParams {
  page?: number;
  limit?: number;
}

export interface CompanyHistoryQueryParams {
  branch?: string;
  department?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceAnalyticsSummary {
  present_count?: number;
  absent_count?: number;
  late_count?: number;
  total_employees?: number;
  attendance_rate?: number;
  [key: string]: unknown;
}

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

export interface AttendanceTrendQueryParams {
  group_by?: "daily" | "weekly" | "monthly" | "department" | "shift";
}

export interface AttendanceTrendData {
  group_by?: "daily" | "weekly" | "monthly" | "department" | "shift" | string;
  trend_points?: Array<{
    label: string;
    count: number;
    date?: string;
    present?: number;
    absent?: number;
    late?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface LateArrivalsData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    check_in_time: string;
    delay_minutes: number;
    department?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}

export interface AttendanceAnomaliesData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    anomaly_type: string;
    description: string;
    detected_at: string;
    severity?: "low" | "medium" | "high" | "critical" | string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}

export interface AbsencePatternData {
  patterns?: Array<{
    employee_id: string;
    employee_name: string;
    pattern_type: string;
    frequency: number;
    risk_level: "low" | "medium" | "high" | string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}

export interface OvertimeData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    overtime_hours: number;
    date: string;
    approved?: boolean;
    [key: string]: unknown;
  }>;
  total_hours?: number;
  [key: string]: unknown;
}

export interface ShiftViolationsData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    violation_type: string;
    details: string;
    date: string;
    shift_name?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}

export interface AttendanceHealthScore {
  score: number;
  rating: "Excellent" | "Good" | "Fair" | "Poor" | "Critical" | string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AbsenteeWatchlist {
  watchlist?: Array<{
    employee_id: string;
    employee_name: string;
    absence_count: number;
    risk_score: number;
    department?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}