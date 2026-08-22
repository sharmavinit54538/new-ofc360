import { CalendarDays, LayoutGrid } from "lucide-react";
import type { HolidayViewMode } from "../types/holidayCalendarState";
import { HolidayViewModeButton } from "./HolidayViewModeButton";

interface Props {
  viewMode: HolidayViewMode;
  onViewModeChange: (m: HolidayViewMode) => void;
}

export function HolidayViewModeSwitcher({ viewMode, onViewModeChange }: Props) {
  return (
    <div className="flex items-center bg-secondary/40 border border-border/50 p-0.5 rounded-xl">
      <HolidayViewModeButton active={viewMode === "calendar"} onClick={() => onViewModeChange("calendar")} icon={<CalendarDays className="w-3.5 h-3.5" />} label="Calendar" />
      <HolidayViewModeButton active={viewMode === "grid"} onClick={() => onViewModeChange("grid")} icon={<LayoutGrid className="w-3.5 h-3.5" />} label="Cards Grid" />
    </div>
  );
}
