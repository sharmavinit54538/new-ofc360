import type { HolidayItem } from "@/stores/attendanceStore";

export interface HolidayCalendarViewProps {
  holidays: HolidayItem[];
  onAddHoliday: (defaultDate?: string) => void;
  onDeleteHoliday: (id: string) => void;
}
