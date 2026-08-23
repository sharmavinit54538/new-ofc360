import { Clock } from "lucide-react";
import { useDigitalClock } from "../../hooks/useDigitalClock";

export function LiveClockBadge() {
  const currentTime = useDigitalClock();
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-xs font-mono font-semibold shadow-2xs">
      <Clock className="w-3.5 h-3.5 text-primary animate-pulse" />
      <span>{currentTime}</span>
    </div>
  );
}
