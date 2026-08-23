import { StationUserProfile } from "./StationUserProfile";
import { StationTelemetry } from "./StationTelemetry";
import { StationActionButton } from "./StationActionButton";

export function TodayStationHero({ user, currentRole, myAttendance, isLoadingMe, isCheckedIn, isCheckedOut, isNotCheckedIn, onCheckIn, onCheckOut }: any) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <StationUserProfile user={user} currentRole={currentRole} myAttendance={myAttendance} isLoadingMe={isLoadingMe} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} />
        <StationTelemetry myAttendance={myAttendance} />
        <StationActionButton isNotCheckedIn={isNotCheckedIn} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} onCheckIn={onCheckIn} onCheckOut={onCheckOut} />
      </div>
    </div>
  );
}
