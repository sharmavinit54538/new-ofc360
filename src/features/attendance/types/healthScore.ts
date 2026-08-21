export interface AttendanceHealthScore {
  score: number;
  rating: "Excellent" | "Good" | "Fair" | "Poor" | "Critical" | string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}
