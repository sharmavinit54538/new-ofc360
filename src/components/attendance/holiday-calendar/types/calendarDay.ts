import type { HolidayItem } from "@/stores/attendanceStore";

export interface CalendarDayCell {
  dayNum: number;
  dateStr: string;
  isCurrentMonth: boolean;
  holidays: HolidayItem[];
}
