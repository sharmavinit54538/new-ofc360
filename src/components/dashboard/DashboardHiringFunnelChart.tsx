import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowRight, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HiringFunnelChartProps {
  candidates?: any[];
}

export function DashboardHiringFunnelChart({ candidates = [] }: HiringFunnelChartProps) {
  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  const totalCandidates = safeCandidates.length;
  const hasLiveCandidates = totalCandidates > 0;

  // Compute stages from live candidates
  const stagesCount = useMemo(() => {
    const counts: Record<string, number> = {
      Sourced: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
    };

    safeCandidates.forEach((c) => {
      const stage = c?.stage || c?.status;
      if (stage && counts[stage] !== undefined) {
        counts[stage] += 1;
      } else if (stage === "Applied" || stage === "New") {
        counts.Sourced += 1;
      } else if (stage === "Technical Round" || stage === "Culture Round") {
        counts.Interview += 1;
      }
    });
    return counts;
  }, [safeCandidates]);

  const funnelData = useMemo(() => {
    return Object.entries(stagesCount).map(([stage, count]) => ({
      stage,
      count,
    }));
  }, [stagesCount]);

  const interviewToOfferRate = useMemo(() => {
    if (stagesCount.Interview === 0) return null;
    return Math.round((stagesCount.Offer / stagesCount.Interview) * 100);
  }, [stagesCount]);

  const FUNNEL_COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#F59E0B", "#10B981"];

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: "12px",
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-base text-foreground">Hiring Funnel & ATS Flow</h3>
          </div>
          <p className="text-xs text-muted-foreground">Candidate progression across recruitment stages</p>
        </div>

        <Link to="/recruitment">
          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
            <span>ATS Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="h-[230px] w-full">
        {!hasLiveCandidates ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
            <UserX className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No candidate applications yet</p>
            <p className="text-xs text-muted-foreground">Post job openings to begin receiving applicants and tracking funnel stages.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="stage"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                width={75}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any) => [`${val} Candidates`, "Stage Count"]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                {funnelData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Active Pipeline:</span>
          <span className="font-bold text-foreground">{totalCandidates} Candidates</span>
        </div>
        {interviewToOfferRate !== null ? (
          <Badge variant="secondary" className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10">
            {interviewToOfferRate}% Interview-to-Offer
          </Badge>
        ) : (
          <span className="text-[11px] text-muted-foreground">Pipeline Stage Flow</span>
        )}
      </div>
    </div>
  );
}
