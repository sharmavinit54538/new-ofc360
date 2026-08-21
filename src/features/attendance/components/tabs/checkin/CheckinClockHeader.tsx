import { Badge } from "@/components/ui/badge";

export function CheckinClockHeader({ currentTime, isClockedIn, isOnBreak }: { currentTime: Date; isClockedIn: boolean; isOnBreak: boolean }) {
  const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="flex items-center justify-between pb-3 border-b border-border/40">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-tight text-foreground">{timeStr}</h2>
        <p className="text-xs text-muted-foreground">{dateStr}</p>
      </div>
      <Badge variant="outline" className={`text-xs px-2.5 py-0.5 ${isClockedIn ? isOnBreak ? "bg-amber-500/10 text-amber-600 border-amber-300" : "bg-emerald-500/10 text-emerald-600 border-emerald-300" : "bg-muted text-muted-foreground"}`}>
        {isClockedIn ? (isOnBreak ? "On Break" : "Clocked In") : "Clocked Out"}
      </Badge>
    </div>
  );
}
