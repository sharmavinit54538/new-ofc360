import { Badge } from "@/components/ui/badge";
import type { PunchRecord } from "../../../types/attendance.types";

export function CheckinTimelineRow({ punch: p }: { punch: PunchRecord }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] py-0">{p.type}</Badge>
          <span className="font-mono font-semibold text-foreground">{p.timestamp}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{p.location || "Facial Punch Station"}</p>
      </div>
      <Badge variant="secondary" className="text-[10px]">{p.status || "On Time"}</Badge>
    </div>
  );
}
