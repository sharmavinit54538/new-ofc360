import { HolidayCalendarView } from "../../holiday-calendar/HolidayCalendarView";
import type { HolidayItem } from "../../../types/attendance.types";

export function HolidaysCalendarContainer({ holidays, isHrOrAdmin, onDelete }: {
  holidays: HolidayItem[]; isHrOrAdmin: boolean; onDelete: (id: string) => void;
}) {
  return (
    <HolidayCalendarView
      holidays={holidays as unknown as Parameters<typeof HolidayCalendarView>[0]["holidays"]}
      canManageHolidays={isHrOrAdmin}
      onDeleteHoliday={onDelete}
    />
  );
}