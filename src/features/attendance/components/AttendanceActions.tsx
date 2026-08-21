import { ClockInButton } from "./actions/ClockInButton";
import { BreakButton } from "./actions/BreakButton";
import { ClockOutButton } from "./actions/ClockOutButton";

export function AttendanceActions({
  isClockedIn, isOnBreak, onClockIn, onToggleBreak, onClockOut, isCheckingIn = false, isCheckingOut = false,
}: {
  isClockedIn: boolean; isOnBreak: boolean; onClockIn: () => void; onToggleBreak: () => void;
  onClockOut: () => void; isCheckingIn?: boolean; isCheckingOut?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {!isClockedIn ? (
        <ClockInButton onClockIn={onClockIn} isCheckingIn={isCheckingIn} />
      ) : (
        <>
          <BreakButton isOnBreak={isOnBreak} onToggleBreak={onToggleBreak} />
          <ClockOutButton onClockOut={onClockOut} isCheckingOut={isCheckingOut} />
        </>
      )}
    </div>
  );
}
