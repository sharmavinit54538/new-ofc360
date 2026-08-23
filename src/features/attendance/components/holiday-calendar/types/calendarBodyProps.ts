import type { HolidayItem } from "@/stores/attendanceStore";
import type { HolidayViewMode } from "./holidayCalendarState";
import type { HolidayCalendarMainProps } from "./calendarMainProps";

export interface HolidayCardsGridProps {
  holidays: HolidayItem[];
  onDeleteHoliday: (id: string) => void;
}

export interface HolidayCalendarBodyProps {
  viewMode: HolidayViewMode;
  mainProps: HolidayCalendarMainProps;
  gridProps: HolidayCardsGridProps;
}
