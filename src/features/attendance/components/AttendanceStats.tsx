import { OverviewStatsCards } from "./stats/OverviewStatsCards";
import { AnalyticsStatsCards } from "./stats/AnalyticsStatsCards";
import type { AttendanceKPIStats } from "../types/attendance.types";

export function AttendanceStats({ stats, variant = "overview" }: { stats: AttendanceKPIStats; variant?: "overview" | "analytics" }) {
  if (variant === "analytics") {
    return <AnalyticsStatsCards stats={stats} />;
  }
  return <OverviewStatsCards stats={stats} />;
}
