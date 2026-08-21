import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";

export function PunchCardActions({ isCheckedIn, isCheckedOut, isLoading, onOpenModal }: {
  isCheckedIn: boolean; isCheckedOut: boolean; isLoading: boolean; onOpenModal: (type: "check-in" | "check-out") => void;
}) {
  if (isCheckedOut) {
    return <Button disabled className="w-full h-9 text-xs">Day Completed</Button>;
  }
  if (isCheckedIn) {
    return (
      <Button onClick={() => onOpenModal("check-out")} disabled={isLoading} variant="destructive" className="w-full h-9 text-xs gap-1.5 font-semibold shadow-sm">
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
        Check Out
      </Button>
    );
  }
  return (
    <Button onClick={() => onOpenModal("check-in")} disabled={isLoading} className="w-full h-9 text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogIn className="h-3.5 w-3.5" />}
      Check In
    </Button>
  );
}
