import type { CalendarDayCell } from "../types/calendarDay";
import type { CalendarNavProps } from "../types/calendarNavProps";
import { CalendarControlsHeader } from "./CalendarControlsHeader";
import { CalendarWeekHeader } from "./CalendarWeekHeader";
import { CalendarDaysGrid } from "./CalendarDaysGrid";
import { CalendarLegend } from "./CalendarLegend";

interface Props extends CalendarNavProps {
  calendarDays: CalendarDayCell[];
  activeDateStr: string | null;
  onSelectDate: (d: string) => void;
}

export function HolidayCalendarGrid(p: Props) {
  return (
    <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-border/60 bg-card shadow-sm space-y-4">
      <CalendarControlsHeader {...p} /><CalendarWeekHeader />
      <CalendarDaysGrid calendarDays={p.calendarDays} activeDateStr={p.activeDateStr} onSelectDate={p.onSelectDate} /><CalendarLegend />
    </div>
  );
}
