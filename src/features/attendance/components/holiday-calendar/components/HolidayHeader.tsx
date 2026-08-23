import type { HolidayViewMode } from "../types/holidayCalendarState";
import { HolidayHeaderTitle } from "./HolidayHeaderTitle";
import { HolidayHeaderActions } from "./HolidayHeaderActions";

interface Props {
  viewMode: HolidayViewMode;
  onViewModeChange: (mode: HolidayViewMode) => void;
  onAddHoliday: () => void;
}

export function HolidayHeader({ viewMode, onViewModeChange, onAddHoliday }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <HolidayHeaderTitle />
      <HolidayHeaderActions viewMode={viewMode} onViewModeChange={onViewModeChange} onAddHoliday={onAddHoliday} />
    </div>
  );
}
