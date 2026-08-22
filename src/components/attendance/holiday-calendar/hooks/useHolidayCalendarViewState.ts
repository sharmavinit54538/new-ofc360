import { useState } from "react";
import type { HolidayItem } from "@/stores/attendanceStore";
import type { HolidayViewMode } from "../types/holidayCalendarState";
import { useHolidayFilterState } from "./useHolidayFilterState";
import { useHolidayNavigation } from "./useHolidayNavigation";
import { useHolidayCalendar } from "./useHolidayCalendar";

export function useHolidayCalendarViewState(holidays: HolidayItem[]) {
  const [viewMode, setViewMode] = useState<HolidayViewMode>("calendar");
  const filters = useHolidayFilterState();
  const nav = useHolidayNavigation();
  const cal = useHolidayCalendar(holidays, filters.searchQuery, filters.selectedType, filters.selectedBranch, nav.year, nav.month);
  return { viewMode, setViewMode, filters, nav, cal };
}
