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
