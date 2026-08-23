import type { HolidayItem } from "@/stores/attendanceStore";

export interface CalendarDayCell {
  dayNum: number;
  dateStr: string;
  isCurrentMonth: boolean;
  holidays: HolidayItem[];
}

export interface CalendarDayCellProps {
  cell: CalendarDayCell;
  isSelected: boolean;
  onSelect: (dateStr: string) => void;
}
