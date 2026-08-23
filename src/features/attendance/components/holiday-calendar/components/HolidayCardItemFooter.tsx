import { Badge } from "@/components/ui/badge";
import type { HolidayItem } from "@/stores/attendanceStore";

export function HolidayCardItemFooter({ holiday }: { holiday: HolidayItem }) {
  const badgeClass = holiday.mandatory ? "bg-emerald-500/15 text-emerald-500 text-[10px]" : "bg-secondary text-muted-foreground text-[10px]";
  return (
    <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/30 flex items-center justify-between">
      <span>{holiday.branchLocation}</span>
      <Badge className={badgeClass}>{holiday.mandatory ? "Mandatory" : "Optional"}</Badge>
    </div>
  );
}
