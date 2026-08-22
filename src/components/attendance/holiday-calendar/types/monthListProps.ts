import type { HolidayItem } from "@/stores/attendanceStore";

export interface MonthHolidaysListProps {
  month: number;
  holidays: HolidayItem[];
  activeDateStr: string | null;
  onSelectDate: (d: string) => void;
}
