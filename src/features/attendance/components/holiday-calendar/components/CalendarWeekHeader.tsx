import { DAYS_OF_WEEK } from "../constants/daysOfWeek";

export function CalendarWeekHeader() {
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground py-1">
      {DAYS_OF_WEEK.map((day, idx) => (
        <div key={day} className={`py-1 rounded-lg ${idx === 0 || idx === 6 ? "text-amber-500/80 bg-amber-500/5 font-semibold" : ""}`}>
          {day}
        </div>
      ))}
    </div>
  );
}
