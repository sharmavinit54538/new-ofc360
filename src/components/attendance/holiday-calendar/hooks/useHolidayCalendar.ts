import { useState, useMemo } from "react";
import type { HolidayItem } from "@/stores/attendanceStore";
import { matchHoliday } from "../utils/holidayFilterUtils";
import { groupHolidaysByDate } from "../utils/holidayGroupUtils";
import { filterCurrentMonthHolidays } from "../utils/holidayMonthUtils";
import { buildCalendarDays } from "../utils/buildCalendarDays";
import { DEFAULT_ACTIVE_DATE } from "../constants/calendarDefaults";

export function useHolidayCalendar(holidays: HolidayItem[], q: string, type: string, branch: string, year: number, month: number) {
  const [activeDateStr, setActiveDateStr] = useState<string | null>(DEFAULT_ACTIVE_DATE);
  const filteredHolidays = useMemo(() => holidays.filter((h) => matchHoliday(h, q, type, branch)), [holidays, q, type, branch]);
  const holidaysByDate = useMemo(() => groupHolidaysByDate(filteredHolidays), [filteredHolidays]);
  const currentMonthHolidays = useMemo(() => filterCurrentMonthHolidays(filteredHolidays, year, month), [filteredHolidays, year, month]);
  const calendarDays = useMemo(() => buildCalendarDays(year, month, holidaysByDate), [year, month, holidaysByDate]);
  const selectedDateHolidays = activeDateStr ? holidaysByDate.get(activeDateStr) || [] : [];
  return { activeDateStr, setActiveDateStr, filteredHolidays, currentMonthHolidays, calendarDays, selectedDateHolidays };
}
