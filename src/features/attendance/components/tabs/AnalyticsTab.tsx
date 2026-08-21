import { AttendanceStats } from "../AttendanceStats";
import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import { AnalyticsComplianceCard } from "./analytics/AnalyticsComplianceCard";
import type { AttendanceKPIStats } from "../../types/attendance.types";

export function AnalyticsTab({ stats, onRefresh, isLoading }: {
  stats: AttendanceKPIStats; onRefresh: () => void; isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <AnalyticsHeader onRefresh={onRefresh} isLoading={isLoading} />
      <AttendanceStats stats={stats} variant="analytics" />
      <AnalyticsComplianceCard />
    </div>
  );
}
