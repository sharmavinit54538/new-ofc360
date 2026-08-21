import { RegularizationHeader } from "./regularization/RegularizationHeader";
import { RegularizationTable } from "./regularization/RegularizationTable";
import { AttendanceFilters } from "../AttendanceFilters";
import type { RegularizationRequest } from "../../types/attendance.types";

export function RegularizationTab(p: {
  list: RegularizationRequest[]; isManagerOrAbove: boolean; onApply: () => void;
  onUpdate: (id: string, s: string) => void; searchQuery: string; setSearchQuery: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <RegularizationHeader onApply={p.onApply} />
      <AttendanceFilters searchQuery={p.searchQuery} onSearchChange={p.setSearchQuery} statusFilter={p.statusFilter} onStatusChange={p.setStatusFilter} placeholder="Filter regularizations..." />
      <RegularizationTable list={p.list} isManagerOrAbove={p.isManagerOrAbove} onUpdate={p.onUpdate} />
    </div>
  );
}
