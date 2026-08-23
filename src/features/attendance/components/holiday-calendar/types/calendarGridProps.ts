import type { CalendarDayCell } from "./calendarDay";
import type { CalendarNavProps } from "./calendarNavProps";

export interface HolidayCalendarGridProps extends CalendarNavProps {
  calendarDays: CalendarDayCell[];
  activeDateStr: string | null;
  onSelectDate: (d: string) => void;
}
