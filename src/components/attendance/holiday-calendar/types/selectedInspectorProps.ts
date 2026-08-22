import type { HolidayItem } from "@/stores/attendanceStore";

export interface SelectedDateInspectorProps {
  activeDateStr: string | null;
  holidays: HolidayItem[];
  onAddHoliday: (d?: string) => void;
  onDeleteHoliday: (id: string) => void;
}
