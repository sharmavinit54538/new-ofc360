import type { HolidayItem } from "@/stores/attendanceStore";
import type { CalendarDayCell } from "../types/calendarDay";
import { getPrevMonthDays } from "./calendarPrevMonthDays";
import { getCurrentMonthDays } from "./calendarCurrentMonthDays";
import { getNextMonthDays } from "./calendarNextMonthDays";

export function buildCalendarDays(
  year: number,
  month: number,
  map: Map<string, HolidayItem[]>
): CalendarDayCell[] {
  const prev = getPrevMonthDays(year, month, map);
  const curr = getCurrentMonthDays(year, month, map);
  const next = getNextMonthDays(year, month, prev.length + curr.length, map);
  return [...prev, ...curr, ...next];
}
