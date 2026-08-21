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
