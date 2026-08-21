import { ClockInButton } from "./actions/ClockInButton";
import { BreakButton } from "./actions/BreakButton";
import { ClockOutButton } from "./actions/ClockOutButton";

export function AttendanceActions({
  isClockedIn, isOnBreak, onClockIn, onToggleBreak, onClockOut, isCheckingIn = false, isCheckingOut = false,
}: any) {
  if (!isClockedIn) {
    return <ClockInButton onClockIn={onClockIn} isCheckingIn={isCheckingIn} />;
  }
  return (
    <div className="flex items-center gap-2">
      <BreakButton isOnBreak={isOnBreak} onToggleBreak={onToggleBreak} />
      <ClockOutButton onClockOut={onClockOut} isCheckingOut={isCheckingOut} />
    </div>
  );
}
