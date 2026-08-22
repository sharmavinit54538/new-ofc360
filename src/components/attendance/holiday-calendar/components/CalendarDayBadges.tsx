import type { HolidayItem } from "@/stores/attendanceStore";
import { getHolidayBadgeStyle } from "../utils/badgeStyle";

export function CalendarDayBadges({ holidays }: { holidays: HolidayItem[] }) {
  return (
    <div className="space-y-1 mt-1 overflow-hidden">
      {holidays.slice(0, 2).map((h) => (
        <div key={h.id} className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate border ${getHolidayBadgeStyle(h.type)}`} title={`${h.title} (${h.type})`}>
          {h.title}
        </div>
      ))}
      {holidays.length > 2 && (
        <span className="text-[9px] text-muted-foreground font-semibold block text-right">+{holidays.length - 2} more</span>
      )}
    </div>
  );
}
