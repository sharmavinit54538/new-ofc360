import { RegularizationHeader } from "./regularization/RegularizationHeader";
import { RegularizationTable } from "./regularization/RegularizationTable";
import { AttendanceFilters } from "../AttendanceFilters";

export function RegularizationTab({ list, isManagerOrAbove, onApply, onUpdate, searchQuery, setSearchQuery, statusFilter, setStatusFilter }: any) {
  return (
    <div className="space-y-3">
      <RegularizationHeader onApply={onApply} />
      <AttendanceFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} statusFilter={statusFilter} onStatusChange={setStatusFilter} placeholder="Filter regularizations..." />
      <RegularizationTable list={list} isManagerOrAbove={isManagerOrAbove} onUpdate={onUpdate} />
    </div>
  );
}
