import { Button } from "@/components/ui/button";
import type { useHolidayFilterState } from "../hooks/useHolidayFilterState";
import { HolidayTypeSelect } from "./HolidayTypeSelect";
import { HolidayBranchSelect } from "./HolidayBranchSelect";

export function HolidayFilterControls({ filters }: { filters: ReturnType<typeof useHolidayFilterState> }) {
  const { selectedType, setSelectedType, selectedBranch, setSelectedBranch, resetFilters, isFiltered } = filters;
  return (
    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
      <HolidayTypeSelect value={selectedType} onChange={setSelectedType} />
      <HolidayBranchSelect value={selectedBranch} onChange={setSelectedBranch} />
      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-muted-foreground hover:text-foreground">
          Reset Filters
        </Button>
      )}
    </div>
  );
}
