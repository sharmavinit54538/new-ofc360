import { AttendanceSearchInput } from "./filters/AttendanceSearchInput";
import { AttendanceStatusSelect } from "./filters/AttendanceStatusSelect";

export function AttendanceFilters({
  searchQuery, onSearchChange, statusFilter, onStatusChange, placeholder = "Search records...", showStatus = true,
}: {
  searchQuery: string; onSearchChange: (v: string) => void;
  statusFilter?: string; onStatusChange?: (v: string) => void;
  placeholder?: string; showStatus?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <AttendanceSearchInput value={searchQuery} onChange={onSearchChange} placeholder={placeholder} />
      {showStatus && onStatusChange && (
        <AttendanceStatusSelect value={statusFilter || "all"} onChange={onStatusChange} />
      )}
    </div>
  );
}
