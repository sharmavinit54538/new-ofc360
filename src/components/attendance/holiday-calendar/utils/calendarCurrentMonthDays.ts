import type { HolidayItem } from "@/stores/attendanceStore";
import type { CalendarDayCell } from "../types/calendarDay";
import { formatCalendarDate } from "./calendarDateHelpers";

export function getCurrentMonthDays(
  year: number,
  month: number,
  map: Map<string, HolidayItem[]>
): CalendarDayCell[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDayCell[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatCalendarDate(year, month, i);
    days.push({ dayNum: i, dateStr, isCurrentMonth: true, holidays: map.get(dateStr) || [] });
  }
  return days;
}
