import { formatSecs } from "../../../utils/attendance.utils";

export function CheckinTimers({ workSeconds, breakSeconds }: { workSeconds: number; breakSeconds: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
      <div>
        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Gross Shift Time</span>
        <p className="text-lg font-bold font-mono text-foreground mt-0.5">{formatSecs(workSeconds)}</p>
      </div>
      <div>
        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Break Duration</span>
        <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">{formatSecs(breakSeconds)}</p>
      </div>
    </div>
  );
}
