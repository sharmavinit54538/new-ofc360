import type { HolidayItem } from "@/stores/attendanceStore";
import type { CalendarDayCell } from "../types/calendarDay";
import { formatCalendarDate } from "./calendarDateHelpers";

export function getPrevMonthDays(year: number, month: number, map: Map<string, HolidayItem[]>): CalendarDayCell[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInPrev = new Date(year, month, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const days: CalendarDayCell[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = daysInPrev - i;
    const dateStr = formatCalendarDate(prevYear, prevMonth, dayNum);
    days.push({ dayNum, dateStr, isCurrentMonth: false, holidays: map.get(dateStr) || [] });
  }
  return days;
}
