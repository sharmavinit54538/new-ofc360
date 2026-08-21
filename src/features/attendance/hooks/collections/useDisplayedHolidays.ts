import { useMemo } from "react";
import type { HolidayItem } from "../types/attendance.types";

export function useDisplayedHolidays(holidaysApiRes: unknown, localHolidays: HolidayItem[]) {
  return useMemo(() => {
    const raw = (holidaysApiRes as { data?: HolidayItem[] })?.data || holidaysApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((h) => ({
        id: h.id || String(Math.random()),
        title: h.title || "Company Holiday",
        date: h.date || new Date().toISOString().split("T")[0],
        type: h.type || "National",
        branchLocation: h.branchLocation || "All Branches",
        mandatory: h.mandatory !== false,
      }));
    }
    return localHolidays;
  }, [holidaysApiRes, localHolidays]);
}
