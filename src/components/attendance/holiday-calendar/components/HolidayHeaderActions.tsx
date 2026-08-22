import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HolidayViewMode } from "../types/holidayCalendarState";
import { HolidayViewModeSwitcher } from "./HolidayViewModeSwitcher";

interface Props {
  viewMode: HolidayViewMode;
  onViewModeChange: (m: HolidayViewMode) => void;
  onAddHoliday: () => void;
}

export function HolidayHeaderActions({ viewMode, onViewModeChange, onAddHoliday }: Props) {
  return (
    <div className="flex items-center gap-2">
      <HolidayViewModeSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <Button onClick={onAddHoliday} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm">
        <Plus className="w-4 h-4" /> Add Company Holiday
      </Button>
    </div>
  );
}
