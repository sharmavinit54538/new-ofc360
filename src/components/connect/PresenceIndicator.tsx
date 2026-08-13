import { PresenceStatus } from "@/types/connect";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PresenceIndicatorProps {
  status?: PresenceStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  withPulse?: boolean;
}

const PRESENCE_CONFIG: Record<
  PresenceStatus,
  { label: string; bgClass: string; borderClass: string; pulseClass: string }
> = {
  online: {
    label: "Online",
    bgClass: "bg-emerald-500",
    borderClass: "border-background",
    pulseClass: "bg-emerald-400 animate-ping",
  },
  away: {
    label: "Away",
    bgClass: "bg-amber-500",
    borderClass: "border-background",
    pulseClass: "bg-amber-400 animate-ping",
  },
  busy: {
    label: "Busy / In Call",
    bgClass: "bg-rose-500",
    borderClass: "border-background",
    pulseClass: "bg-rose-400 animate-ping",
  },
  dnd: {
    label: "Do Not Disturb",
    bgClass: "bg-purple-600",
    borderClass: "border-background",
    pulseClass: "bg-purple-400 animate-ping",
  },
  offline: {
    label: "Offline",
    bgClass: "bg-slate-400 dark:bg-slate-500",
    borderClass: "border-background",
    pulseClass: "",
  },
};

const SIZES = {
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
};

export function PresenceIndicator({
  status = "offline",
  size = "md",
  showLabel = false,
  className = "",
  withPulse = false,
}: PresenceIndicatorProps) {
  const config = PRESENCE_CONFIG[status] || PRESENCE_CONFIG.offline;
  const sizeClass = SIZES[size];

  const dot = (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {withPulse && status === "online" && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulseClass}`}
        />
      )}
      <span
        className={`relative inline-block rounded-full border-2 ${config.borderClass} ${config.bgClass} ${sizeClass}`}
      />
    </div>
  );

  if (showLabel) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {dot}
        <span>{config.label}</span>
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default">{dot}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs py-0.5 px-2">
        {config.label}
      </TooltipContent>
    </Tooltip>
  );
}
