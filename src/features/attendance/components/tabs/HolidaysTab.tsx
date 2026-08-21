import { HolidaysHeader } from "./holidays/HolidaysHeader";
import { HolidaysCalendarContainer } from "./holidays/HolidaysCalendarContainer";
import type { HolidayItem } from "../../types/attendance.types";

export function HolidaysTab({ holidays, isHrOrAdmin, onAddHoliday, onDeleteHoliday }: {
  holidays: HolidayItem[]; isHrOrAdmin: boolean; onAddHoliday: () => void; onDeleteHoliday: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <HolidaysHeader isHrOrAdmin={isHrOrAdmin} onAddHoliday={onAddHoliday} />
      <HolidaysCalendarContainer holidays={holidays} isHrOrAdmin={isHrOrAdmin} onDelete={onDeleteHoliday} />
    </div>
  );
}
