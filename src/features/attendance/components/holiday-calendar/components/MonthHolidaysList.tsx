import type { MonthHolidaysListProps } from "../types/monthListProps";
import { MonthHolidaysListHeader } from "./MonthHolidaysListHeader";
import { MonthHolidayItem } from "./MonthHolidayItem";
import { MonthHolidaysEmpty } from "./MonthHolidaysEmpty";

export function MonthHolidaysList({ month, holidays = [], activeDateStr, onSelectDate }: MonthHolidaysListProps) {
  const items = holidays.length === 0 ? <MonthHolidaysEmpty /> : holidays.map((h) => (
    <MonthHolidayItem key={h.id} holiday={h} isActive={activeDateStr === h.date} onSelect={onSelectDate} />
  ));
  return (
    <div className="glass-card rounded-3xl p-5 border border-border/60 bg-card shadow-sm space-y-3 flex-1">
      <MonthHolidaysListHeader month={month} total={holidays.length} />
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">{items}</div>
    </div>
  );
}
