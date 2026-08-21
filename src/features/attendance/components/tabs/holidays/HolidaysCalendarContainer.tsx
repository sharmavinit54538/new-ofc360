import { HolidayCalendarView } from "@/components/attendance/HolidayCalendarView";
import type { HolidayItem } from "../../../types/attendance.types";

export function HolidaysCalendarContainer({ holidays, isHrOrAdmin, onDelete }: {
  holidays: HolidayItem[]; isHrOrAdmin: boolean; onDelete: (id: string) => void;
}) {
  return (
    <HolidayCalendarView
      holidays={holidays as any}
      canManageHolidays={isHrOrAdmin}
      onDeleteHoliday={onDelete}
    />
  );
}
