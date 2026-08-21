import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function ClockOutButton({ onClockOut, isCheckingOut }: { onClockOut: () => void; isCheckingOut: boolean }) {
  return (
    <Button onClick={onClockOut} disabled={isCheckingOut} variant="destructive" className="h-9 px-4 text-xs font-semibold shadow-sm flex items-center gap-1.5">
      {isCheckingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
      Clock Out
    </Button>
  );
}
