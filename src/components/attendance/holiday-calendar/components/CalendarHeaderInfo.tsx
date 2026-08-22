import { Calendar as CalendarIcon } from "lucide-react";
import { MONTH_NAMES } from "../constants/monthNames";

interface Props {
  year: number;
  month: number;
  holidayCount: number;
}

export function CalendarHeaderInfo({ year, month, holidayCount }: Props) {
  const countLabel = `${holidayCount} ${holidayCount === 1 ? "Holiday" : "Holidays"} scheduled this month`;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
        <CalendarIcon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-foreground tracking-tight">{MONTH_NAMES[month]} {year}</h3>
        <span className="text-[11px] text-muted-foreground font-medium">{countLabel}</span>
      </div>
    </div>
  );
}
