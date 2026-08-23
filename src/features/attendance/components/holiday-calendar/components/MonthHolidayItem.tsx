import { Badge } from "@/components/ui/badge";
import type { HolidayItem } from "@/stores/attendanceStore";
import { getHolidayBadgeStyle } from "../utils/badgeStyle";

export function MonthHolidayItem({ holiday, isActive, onSelect }: { holiday: HolidayItem; isActive: boolean; onSelect: (d: string) => void }) {
  const activeClass = isActive ? "bg-primary/10 border-primary/40 text-foreground" : "bg-secondary/25 border-border/40 hover:bg-secondary/40";
  return (
    <div onClick={() => onSelect(holiday.date)} className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${activeClass}`}>
      <div className="min-w-0 pr-2">
        <span className="font-bold text-foreground block truncate">{holiday.title}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{holiday.date}</span>
      </div>
      <Badge className={`text-[9px] font-semibold shrink-0 ${getHolidayBadgeStyle(holiday.type)}`}>{holiday.type}</Badge>
    </div>
  );
}
