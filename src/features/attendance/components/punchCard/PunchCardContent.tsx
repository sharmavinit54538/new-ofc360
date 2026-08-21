import { CardContent } from "@/components/ui/card";
import { PunchCardStatusBadge } from "./PunchCardStatusBadge";
import { PunchCardTimers } from "./PunchCardTimers";
import { PunchCardLocationInfo } from "./PunchCardLocationInfo";
import { PunchCardActions } from "./PunchCardActions";
import type { AttendanceTodayState } from "../../types/attendance.types";

export function PunchCardContent(p: {
  today?: AttendanceTodayState; isCheckedIn: boolean; isCheckedOut: boolean;
  isLoading: boolean; onOpenModal: (type: "check-in" | "check-out") => void;
}) {
  return (
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Today's Status</span><PunchCardStatusBadge isCheckedIn={p.isCheckedIn} isCheckedOut={p.isCheckedOut} /></div>
      <PunchCardTimers today={p.today} />
      <PunchCardLocationInfo />
      <PunchCardActions isCheckedIn={p.isCheckedIn} isCheckedOut={p.isCheckedOut} isLoading={p.isLoading} onOpenModal={p.onOpenModal} />
    </CardContent>
  );
}
