import type { HolidayCardsGridProps } from "../types/calendarBodyProps";
import { HolidayCardItem } from "./HolidayCardItem";
import { HolidayEmptyState } from "./HolidayEmptyState";

export function HolidayCardsGrid({ holidays = [], onDeleteHoliday }: HolidayCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {holidays.length > 0 ? holidays.map((h) => (
        <HolidayCardItem key={h.id} holiday={h} onDelete={onDeleteHoliday} />
      )) : (
        <HolidayEmptyState />
      )}
    </div>
  );
}
