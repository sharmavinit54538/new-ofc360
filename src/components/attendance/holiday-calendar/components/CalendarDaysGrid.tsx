import type { CalendarDayCell as ICalendarDayCell } from "../types/calendarDay";
import { CalendarDayCell } from "./CalendarDayCell";

interface Props {
  calendarDays: ICalendarDayCell[];
  activeDateStr: string | null;
  onSelectDate: (dateStr: string) => void;
}

export function CalendarDaysGrid({ calendarDays, activeDateStr, onSelectDate }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {calendarDays.map((cell, index) => (
        <CalendarDayCell key={index} cell={cell} isSelected={activeDateStr === cell.dateStr} onSelect={onSelectDate} />
      ))}
    </div>
  );
}
