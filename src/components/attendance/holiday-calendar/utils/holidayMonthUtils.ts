import type { HolidayItem } from "@/stores/attendanceStore";

export function filterCurrentMonthHolidays(
  holidays: HolidayItem[],
  year: number,
  month: number
): HolidayItem[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return holidays.filter((h) => h.date.startsWith(prefix));
}
