import { Sparkles, TrendingUp, CalendarCheck, Award, Info, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AISignalsProps {
  insights?: { tone: "positive" | "warn" | "info" | "primary"; text: string }[];
}

export function DashboardAISignals({ insights = [] }: AISignalsProps) {
  const safeInsights = Array.isArray(insights) ? insights : [];

  const getIcon = (tone: string) => {
    switch (tone) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />;
      case "warn":
        return <CalendarCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />;
      case "primary":
        return <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />;
    }
  };

  const getToneBadge = (tone: string) => {
    switch (tone) {
      case "positive":
        return { label: "Optimal", badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
      case "warn":
        return { label: "Action Required", badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
      case "primary":
        return { label: "System", badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30" };
      default:
        return { label: "Telemetry", badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/30" };
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">OFC360 AI Intelligence & Signals</h3>
              <p className="text-xs text-muted-foreground">Autonomous organization health telemetry</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

        <div className="space-y-3 mt-2">
          {safeInsights.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <p className="font-medium text-foreground">AI telemetry running</p>
              <p className="text-[11px] text-muted-foreground">Real-time alerts and workforce signals will populate as system activity occurs.</p>
            </div>
          ) : (
            safeInsights.map((insight, idx) => {
              const badge = getToneBadge(insight.tone);
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/40 hover:bg-secondary/40 transition-colors flex items-start gap-2.5"
                >
                  {getIcon(insight.tone)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground">Signal #{idx + 1}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.badgeClass}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border/40 mt-4">
        <Link to="/intelligence">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs text-primary justify-between h-8 px-2 hover:bg-primary/10 cursor-pointer"
          >
            <span>Launch Full AI Copilot Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
