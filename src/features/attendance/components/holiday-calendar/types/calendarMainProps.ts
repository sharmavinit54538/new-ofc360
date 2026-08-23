import type { CalendarDayCell } from "./calendarDay";
import type { HolidayItem } from "@/stores/attendanceStore";
import type { CalendarNavProps } from "./calendarNavProps";

export interface HolidayCalendarMainProps extends CalendarNavProps {
  calendarDays: CalendarDayCell[];
  activeDateStr: string | null;
  selectedDateHolidays: HolidayItem[];
  currentMonthHolidays: HolidayItem[];
  onSelectDate: (d: string) => void;
  onAddHoliday: (d?: string) => void;
  onDeleteHoliday: (id: string) => void;
}
