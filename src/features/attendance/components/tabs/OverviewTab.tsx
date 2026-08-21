import { AttendanceStats } from "../AttendanceStats";
import { OverviewHeader } from "./overview/OverviewHeader";
import { OverviewTable } from "./overview/OverviewTable";
import type { PunchRecord, AttendanceKPIStats } from "../../types/attendance.types";

export function OverviewTab({ list, stats, onExport, isExporting }: {
  list: PunchRecord[]; stats: AttendanceKPIStats; onExport: () => void; isExporting: boolean;
}) {
  return (
    <div className="space-y-4">
      <AttendanceStats stats={stats} />
      <OverviewHeader count={list.length} onExport={onExport} isExporting={isExporting} />
      <OverviewTable list={list} />
    </div>
  );
}
