import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, AlertTriangle, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import type { SignalStatus, SignalType } from "@/services/people-ai/peopleAiTypes";

interface PeopleAISignalBadgeProps {
  status?: SignalStatus;
  type?: SignalType;
  headline?: string;
  metric?: string | number;
  showIcon?: boolean;
  className?: string;
}

export const PeopleAISignalBadge: React.FC<PeopleAISignalBadgeProps> = ({
  status = "positive",
  type = "performance",
  headline,
  metric,
  showIcon = true,
  className = "",
}) => {
  let badgeStyle = "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  let Icon = CheckCircle2;
  let label = "Positive Signal";

  switch (status) {
    case "critical":
      badgeStyle = "bg-destructive/15 text-destructive border-destructive/30";
      Icon = AlertCircle;
      label = "Critical Alert";
      break;
    case "attention_required":
      badgeStyle = "bg-amber-500/15 text-amber-500 border-amber-500/30";
      Icon = AlertTriangle;
      label = "Attention Required";
      break;
    case "insufficient_data":
      badgeStyle = "bg-muted/40 text-muted-foreground border-border/60";
      Icon = HelpCircle;
      label = "Insufficient Data";
      break;
    case "positive":
    default:
      badgeStyle = "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      Icon = Sparkles;
      label = "Positive Signal";
      break;
  }

  const content = (
    <Badge
      variant="outline"
      className={`text-[10px] font-semibold gap-1 px-2 py-0.5 tracking-tight uppercase cursor-help transition-all ${badgeStyle} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{metric ? `${label}: ${metric}` : label}</span>
    </Badge>
  );

  if (!headline) return content;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs font-normal p-2.5 shadow-lg border border-border/60">
          <p className="font-bold text-foreground mb-0.5">{label} ({type})</p>
          <p className="text-muted-foreground leading-relaxed">{headline}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
