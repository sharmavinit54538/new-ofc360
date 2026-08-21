export function PunchCardTimers({ today }: { today?: { check_in_time?: string; check_out_time?: string; working_hours?: number } }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg border border-border/40">
      <div>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Check-In</span>
        <p className="font-mono font-medium text-foreground">{today?.check_in_time || "—"}</p>
      </div>
      <div>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Check-Out</span>
        <p className="font-mono font-medium text-foreground">{today?.check_out_time || "—"}</p>
      </div>
    </div>
  );
}
