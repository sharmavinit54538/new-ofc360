import type { CalendarDayCellProps } from "../types/calendarDay";
import { isTodayDate } from "../utils/calendarDateHelpers";
import { getCalendarCellClassName, getCalendarDayNumClassName } from "../utils/calendarCellStyles";
import { CalendarDayCellHeader } from "./CalendarDayCellHeader";
import { CalendarDayBadges } from "./CalendarDayBadges";

export function CalendarDayCell({ cell, isSelected, onSelect }: CalendarDayCellProps) {
  const holidays = Array.isArray(cell?.holidays) ? cell.holidays : [];
  const numClass = getCalendarDayNumClassName(isTodayDate(cell.dateStr), isSelected, cell.isCurrentMonth);
  const cellClass = getCalendarCellClassName(cell.isCurrentMonth, isSelected, holidays.length > 0);
  return (
    <div onClick={() => onSelect(cell.dateStr)} className={`min-h-[85px] sm:min-h-[96px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${cellClass}`}>
      <CalendarDayCellHeader dayNum={cell.dayNum} numClass={numClass} hasHolidays={holidays.length > 0} />
      <CalendarDayBadges holidays={holidays} />
    </div>
  );
}
