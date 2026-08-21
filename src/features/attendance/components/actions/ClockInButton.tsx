import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";

export function ClockInButton({ onClockIn, isCheckingIn }: { onClockIn: () => void; isCheckingIn: boolean }) {
  return (
    <Button onClick={onClockIn} disabled={isCheckingIn} className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5">
      {isCheckingIn ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogIn className="h-3.5 w-3.5" />}
      Clock In
    </Button>
  );
}
