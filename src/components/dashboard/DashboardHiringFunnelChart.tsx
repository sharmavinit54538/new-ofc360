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
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HiringFunnelChartProps {
  candidates?: any[];
}

export function DashboardHiringFunnelChart({ candidates = [] }: HiringFunnelChartProps) {
  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  // Compute stages from live candidates or fallback funnel
  const stagesCount: Record<string, number> = {
    Sourced: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Hired: 0,
  };

  if (safeCandidates.length > 0) {
    safeCandidates.forEach((c) => {
      const stage = c?.stage || c?.status;
      if (stage && stagesCount[stage] !== undefined) {
        stagesCount[stage] += 1;
      } else if (stage === "Applied") {
        stagesCount.Sourced += 1;
      }
    });
  }

  const hasLiveCandidates = Object.values(stagesCount).some((c) => c > 0);

  const funnelData = hasLiveCandidates
    ? Object.entries(stagesCount).map(([stage, count]) => ({
        stage,
        count,
      }))
    : [
        { stage: "Sourced", count: 12, fill: "#6366F1" },
        { stage: "Screening", count: 8, fill: "#8B5CF6" },
        { stage: "Interview", count: 4, fill: "#06B6D4" },
        { stage: "Offer", count: 2, fill: "#F59E0B" },
        { stage: "Hired", count: 1, fill: "#10B981" },
      ];

  const FUNNEL_COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#F59E0B", "#10B981"];

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: "12px",
  };

  const totalCandidates = funnelData.reduce((s, f) => s + f.count, 0);

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
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Active Pipeline:</span>
          <span className="font-bold text-foreground">{totalCandidates} Candidates</span>
        </div>
        <Badge variant="secondary" className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10">
          25% Interview-to-Offer
        </Badge>
      </div>
    </div>
  );
}
