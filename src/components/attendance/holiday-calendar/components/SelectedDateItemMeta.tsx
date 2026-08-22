import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HolidayItem } from "@/stores/attendanceStore";

export function SelectedDateItemMeta({ holiday }: { holiday: HolidayItem }) {
  const badgeClass = holiday.mandatory ? "bg-emerald-500/15 text-emerald-500 text-[9px]" : "bg-secondary text-muted-foreground text-[9px]";
  return (
    <div className="text-[11px] text-muted-foreground space-y-1 pt-1.5 border-t border-border/30">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {holiday.branchLocation}</span>
        <Badge className={badgeClass}>{holiday.mandatory ? "Mandatory" : "Optional"}</Badge>
      </div>
    </div>
  );
}
