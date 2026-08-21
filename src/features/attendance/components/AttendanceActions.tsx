import { LogIn, LogOut, Coffee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  isClockedIn: boolean;
  isOnBreak: boolean;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  onCheckIn: () => void;
  onToggleBreak: () => void;
  onCheckOut: () => void;
}

export function AttendanceActions({
  isClockedIn,
  isOnBreak,
  isCheckingIn,
  isCheckingOut,
  onCheckIn,
  onToggleBreak,
  onCheckOut,
}: AttendanceActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
      <Button
        onClick={onCheckIn}
        disabled={isClockedIn || isCheckingIn}
        className="h-12 gradient-bg text-primary-foreground font-bold text-xs rounded-xl shadow-md gap-2"
      >
        {isCheckingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        <span>{isCheckingIn ? "Clocking In..." : "Clock In"}</span>
      </Button>

      <Button
        onClick={onToggleBreak}
        disabled={!isClockedIn}
        variant="outline"
        className="h-12 text-xs font-bold rounded-xl border-border/70 bg-secondary/30 gap-2"
      >
        <Coffee className="w-4 h-4" />
        <span>{isOnBreak ? "Resume Work" : "Take Break"}</span>
      </Button>

      <Button
        onClick={onCheckOut}
        disabled={!isClockedIn || isCheckingOut}
        variant="destructive"
        className="h-12 text-xs font-bold rounded-xl shadow-md gap-2"
      >
        {isCheckingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>{isCheckingOut ? "Clocking Out..." : "Clock Out"}</span>
      </Button>
    </div>
  );
}
