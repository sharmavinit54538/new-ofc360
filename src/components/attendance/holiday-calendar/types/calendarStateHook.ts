import type { HolidayViewMode } from "./holidayCalendarState";
import type { useHolidayFilterState } from "../hooks/useHolidayFilterState";
import type { useHolidayNavigation } from "../hooks/useHolidayNavigation";
import type { useHolidayCalendar } from "../hooks/useHolidayCalendar";

export interface HolidayCalendarViewState {
  viewMode: HolidayViewMode;
  setViewMode: (mode: HolidayViewMode) => void;
  filters: ReturnType<typeof useHolidayFilterState>;
  nav: ReturnType<typeof useHolidayNavigation>;
  cal: ReturnType<typeof useHolidayCalendar>;
}
