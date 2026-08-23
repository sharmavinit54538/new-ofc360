import { ReportDomainSelect } from "./ReportDomainSelect";
import { ReportDateRangeSelect } from "./ReportDateRangeSelect";
import { ReportExportButtons } from "./ReportExportButtons";

export function ReportsPageControlsHeader({ activeTab, onSelectTab, dateRange, setDateRange, onExport }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
      <ReportDomainSelect activeTab={activeTab} onSelect={onSelectTab} />
      <div className="flex items-center gap-2 shrink-0">
        <ReportDateRangeSelect dateRange={dateRange} setDateRange={setDateRange} />
        <ReportExportButtons onExport={onExport} />
      </div>
    </div>
  );
}
