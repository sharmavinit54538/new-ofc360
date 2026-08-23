import type { HolidayItem } from "@/stores/attendanceStore";

export interface HolidayCardItemProps {
  holiday: HolidayItem;
  onDelete: (id: string) => void;
}
