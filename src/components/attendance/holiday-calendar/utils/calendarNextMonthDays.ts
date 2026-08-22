import type { HolidayItem } from "@/stores/attendanceStore";
import type { CalendarDayCell } from "../types/calendarDay";
import { formatCalendarDate } from "./calendarDateHelpers";

export function getNextMonthDays(
  year: number,
  month: number,
  currLen: number,
  map: Map<string, HolidayItem[]>
): CalendarDayCell[] {
  const remaining = 42 - currLen;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const days: CalendarDayCell[] = [];
  for (let i = 1; i <= remaining; i++) {
    const dateStr = formatCalendarDate(nextYear, nextMonth, i);
    days.push({ dayNum: i, dateStr, isCurrentMonth: false, holidays: map.get(dateStr) || [] });
  }
  return days;
}
