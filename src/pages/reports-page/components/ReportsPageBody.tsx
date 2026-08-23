import { ReportsPageControlsHeader } from "./header/ReportsPageControlsHeader";
import { ReportsPageContent } from "./ReportsPageContent";

export function ReportsPageBody({ d }: { d: any }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ReportsPageControlsHeader activeTab={d.p.activeTab} onSelectTab={d.p.setTab} dateRange={d.p.dateRange} setDateRange={d.p.setDateRange} onExport={d.p.handleExport} />
      <ReportsPageContent d={d} />
    </div>
  );
}
