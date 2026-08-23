import type { HolidayItem } from "@/stores/attendanceStore";

export function groupHolidaysByDate(
  holidays: HolidayItem[]
): Map<string, HolidayItem[]> {
  const map = new Map<string, HolidayItem[]>();
  holidays.forEach((h) => {
    const key = h.date.includes("T") ? h.date.split("T")[0] : h.date.trim();
    const existing = map.get(key) || [];
    existing.push(h);
    map.set(key, existing);
  });
  return map;
}
