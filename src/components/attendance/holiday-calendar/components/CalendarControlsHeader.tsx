import type { CalendarNavProps } from "../types/calendarNavProps";
import { CalendarHeaderInfo } from "./CalendarHeaderInfo";
import { CalendarControlsNav } from "./CalendarControlsNav";

export function CalendarControlsHeader(props: CalendarNavProps) {
  const { year, month, holidayCount, onPrev, onNext, onToday } = props;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
      <CalendarHeaderInfo year={year} month={month} holidayCount={holidayCount} />
      <CalendarControlsNav onPrev={onPrev} onNext={onNext} onToday={onToday} />
    </div>
  );
}
