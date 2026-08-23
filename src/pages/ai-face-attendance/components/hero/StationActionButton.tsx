import { Camera, LogOut, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StationActionButton({ isNotCheckedIn, isCheckedIn, isCheckedOut, onCheckIn, onCheckOut }: any) {
  return (
    <div className="flex flex-col items-stretch sm:items-end justify-center gap-2 min-w-[200px]">
      {isNotCheckedIn && (
        <Button onClick={onCheckIn} size="lg" className="gradient-bg text-primary-foreground font-semibold text-sm gap-2 shadow-md hover:shadow-lg transition-all h-12 px-6"><Camera className="w-5 h-5" /><span>Face Check In</span></Button>
      )}
      {isCheckedIn && (
        <Button onClick={onCheckOut} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm gap-2 shadow-md hover:shadow-lg transition-all h-12 px-6"><LogOut className="w-5 h-5" /><span>Face Check Out</span></Button>
      )}
      {isCheckedOut && (
        <Button disabled size="lg" variant="outline" className="font-semibold text-sm gap-2 h-12 px-6 bg-muted/30 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-5 h-5" /><span>Attendance Completed</span></Button>
      )}
      <p className="text-[11px] text-muted-foreground text-center sm:text-right flex items-center gap-1 justify-center sm:justify-end"><ShieldCheck className="w-3.5 h-3.5 text-primary" /><span>Biometric Anti-Spoofing Enabled</span></p>
    </div>
  );
}
