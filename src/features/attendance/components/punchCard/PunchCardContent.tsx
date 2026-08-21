import { CardContent } from "@/components/ui/card";
import { PunchCardStatusBadge } from "./PunchCardStatusBadge";
import { PunchCardTimers } from "./PunchCardTimers";
import { PunchCardLocationInfo } from "./PunchCardLocationInfo";
import { PunchCardActions } from "./PunchCardActions";

export function PunchCardContent({ today, isCheckedIn, isCheckedOut, isLoading, onOpenModal }: any) {
  return (
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Today's Status</span>
        <PunchCardStatusBadge isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} />
      </div>
      <PunchCardTimers today={today} />
      <PunchCardLocationInfo />
      <PunchCardActions isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} isLoading={isLoading} onOpenModal={onOpenModal} />
    </CardContent>
  );
}
