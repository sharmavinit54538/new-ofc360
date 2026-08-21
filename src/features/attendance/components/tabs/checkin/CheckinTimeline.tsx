import { Card, CardContent } from "@/components/ui/card";
import { CheckinTimelineRow } from "./CheckinTimelineRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { PunchRecord } from "../../../types/attendance.types";

export function CheckinTimeline({ list }: { list: PunchRecord[] }) {
  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-xs font-semibold text-foreground tracking-wide uppercase">Today's Punch Log</h3>
        {list.length === 0 ? (
          <AttendanceEmptyState description="No punches recorded for your station yet today." />
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {list.map((p) => (<CheckinTimelineRow key={p.id} punch={p} />))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
