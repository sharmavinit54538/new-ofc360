import { LogIn, LogOut, Timer } from "lucide-react";

export function StationTelemetry({ myAttendance }: { myAttendance: any }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-0.5 min-w-[110px]"><span className="text-[11px] text-muted-foreground flex items-center gap-1"><LogIn className="w-3 h-3 text-emerald-500" /> Check In</span><p className="text-sm font-bold text-foreground">{myAttendance?.checkInTime || "—"}</p></div>
      <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-0.5 min-w-[110px]"><span className="text-[11px] text-muted-foreground flex items-center gap-1"><LogOut className="w-3 h-3 text-blue-500" /> Check Out</span><p className="text-sm font-bold text-foreground">{myAttendance?.checkOutTime || "—"}</p></div>
      <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-0.5 min-w-[110px] col-span-2 sm:col-span-1"><span className="text-[11px] text-muted-foreground flex items-center gap-1"><Timer className="w-3 h-3 text-primary" /> Hours Worked</span><p className="text-sm font-bold text-foreground">{myAttendance?.workingDuration ? `${myAttendance.workingDuration}` : "—"}</p></div>
    </div>
  );
}
