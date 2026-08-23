import type { HolidayCalendarMainProps } from "../types/calendarMainProps";
import { HolidayCalendarGrid } from "./HolidayCalendarGrid";
import { HolidayCalendarSidebar } from "./HolidayCalendarSidebar";

export function HolidayCalendarMain(p: HolidayCalendarMainProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <HolidayCalendarGrid {...p} />
      <HolidayCalendarSidebar {...p} />
    </div>
  );
}
