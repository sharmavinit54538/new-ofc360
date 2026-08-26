import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  ShieldCheck,
  ArrowRight,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PeopleIntelligenceSummary } from "@/services/people-ai/peopleAiTypes";

interface PeopleCommandCenterBarProps {
  summary?: PeopleIntelligenceSummary;
  onOpenCopilot: () => void;
  onOpenApprovals: () => void;
  onOpenDataHealth: () => void;
  onSelectTab: (tab: "employees" | "departments" | "manager" | "executive" | "it_admin") => void;
}

export const PeopleCommandCenterBar: React.FC<PeopleCommandCenterBarProps> = ({
  summary,
  onOpenCopilot,
  onOpenApprovals,
  onOpenDataHealth,
  onSelectTab,
}) => {
  const criticalCount = summary?.criticalIssuesCount ?? 3;
  const attentionCount = summary?.attentionRequiredCount ?? 7;
  const actionsCount = summary?.recommendedActionsCount ?? 12;
  const eventsCount = summary?.upcomingEventsCount ?? 5;
  const approvalsCount = summary?.pendingApprovalsCount ?? 8;
  const dataHealth = summary?.dataHealthScore ?? 96;

  const statPills = [
    {
      id: "critical",
      label: "Critical Issues",
      count: criticalCount,
      icon: AlertCircle,
      badgeStyle: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25",
      onClick: () => onSelectTab("employees"),
    },
    {
      id: "attention",
      label: "Attention Required",
      count: attentionCount,
      icon: AlertTriangle,
      badgeStyle: "bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/25",
      onClick: () => onSelectTab("employees"),
    },
    {
      id: "actions",
      label: "Recommended Actions",
      count: actionsCount,
      icon: CheckCircle2,
      badgeStyle: "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25",
      onClick: onOpenApprovals,
    },
    {
      id: "events",
      label: "Upcoming Events",
      count: eventsCount,
      icon: Calendar,
      badgeStyle: "bg-blue-500/15 text-blue-500 border-blue-500/30 hover:bg-blue-500/25",
      onClick: () => onSelectTab("manager"),
    },
    {
      id: "approvals",
      label: "Pending Approvals",
      count: approvalsCount,
      icon: Layers,
      badgeStyle: "bg-purple-500/15 text-purple-500 border-purple-500/30 hover:bg-purple-500/25",
      onClick: onOpenApprovals,
    },
    {
      id: "health",
      label: `Data Health: ${dataHealth}%`,
      count: null,
      icon: ShieldCheck,
      badgeStyle: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/25",
      onClick: onOpenDataHealth,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 shadow-sm space-y-3"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <span>Today's People Intelligence</span>
              </h2>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-mono font-bold">
                LIVE
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Autonomous monitoring active across workforce presence, milestone delivery, and organizational telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onOpenCopilot}
            className="gradient-bg text-primary-foreground text-xs h-8 px-3 font-semibold shadow-xs gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask People AI</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenApprovals}
            className="text-xs h-8 px-3 font-semibold border-border/60 gap-1.5 hover:bg-secondary/70 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>Operations Queue ({approvalsCount})</span>
          </Button>
        </div>
      </div>

      {/* Metric Action Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {statPills.map((pill) => {
          const Icon = pill.icon;
          return (
            <button
              key={pill.id}
              onClick={pill.onClick}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left ${pill.badgeStyle}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pill.label}</span>
              </div>
              {pill.count !== null && (
                <span className="font-mono font-bold ml-1 text-[11px] shrink-0">
                  {pill.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
