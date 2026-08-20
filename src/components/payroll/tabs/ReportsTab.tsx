import { ReportsHeader } from "./reports/ReportsHeader";
import { ReportsStatsGrid } from "./reports/ReportsStatsGrid";

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsStatsGrid />
    </div>
  );
}
