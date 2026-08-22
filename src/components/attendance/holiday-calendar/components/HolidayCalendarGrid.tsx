import type { HolidayCalendarGridProps } from "../types/calendarGridProps";
import { CalendarControlsHeader } from "./CalendarControlsHeader";
import { CalendarWeekHeader } from "./CalendarWeekHeader";
import { CalendarDaysGrid } from "./CalendarDaysGrid";
import { CalendarLegend } from "./CalendarLegend";

export function HolidayCalendarGrid(p: HolidayCalendarGridProps) {
  return (
    <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-border/60 bg-card shadow-sm space-y-4">
      <CalendarControlsHeader {...p} />
      <CalendarWeekHeader />
      <CalendarDaysGrid calendarDays={p.calendarDays} activeDateStr={p.activeDateStr} onSelectDate={p.onSelectDate} />
      <CalendarLegend />
    </div>
  );
}
