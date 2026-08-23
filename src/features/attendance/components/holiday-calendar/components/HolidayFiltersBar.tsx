import type { useHolidayFilterState } from "../hooks/useHolidayFilterState";
import { HolidaySearchBar } from "./HolidaySearchBar";
import { HolidayFilterControls } from "./HolidayFilterControls";

interface Props {
  filters: ReturnType<typeof useHolidayFilterState>;
}

export function HolidayFiltersBar({ filters }: Props) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
      <HolidaySearchBar value={filters.searchQuery} onChange={filters.setSearchQuery} />
      <HolidayFilterControls filters={filters} />
    </div>
  );
}
