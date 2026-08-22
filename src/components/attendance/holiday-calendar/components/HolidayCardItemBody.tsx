import { Calendar as CalendarIcon } from "lucide-react";
import type { HolidayItem } from "@/stores/attendanceStore";

export function HolidayCardItemBody({ holiday }: { holiday: HolidayItem }) {
  return (
    <div>
      <h3 className="font-bold text-sm text-foreground">{holiday.title}</h3>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-mono">
        <CalendarIcon className="w-3.5 h-3.5 text-primary" /> {holiday.date}
      </p>
    </div>
  );
}
