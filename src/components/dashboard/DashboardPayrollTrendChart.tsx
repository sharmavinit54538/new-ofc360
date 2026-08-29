import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, ArrowRight, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fmtMoney } from "@/utils/currency";

interface PayrollTrendChartProps {
  monthlyPayroll?: number;
  runs?: any[];
}

export function DashboardPayrollTrendChart({
  monthlyPayroll = 0,
  runs = [],
}: PayrollTrendChartProps) {
    const safeRuns = useMemo(() => Array.isArray(runs) ? runs : [], [runs]);

  const trendData = useMemo(() => {
    if (safeRuns.length > 0) {
      return [...safeRuns]
        .slice(0, 6)
        .reverse()
        .map((r) => ({
          m: `${(r?.month || "Month").slice(0, 3)} '${String(r?.year || 2026).slice(-2)}`,
          v: Number(((r?.netTotal || r?.grossTotal || 0) / 100000).toFixed(1)),
          fullVal: r?.netTotal || r?.grossTotal || 0,
        }));
    }
    if (monthlyPayroll > 0) {
      return [
        {
          m: "Current Run",
          v: Number((monthlyPayroll / 100000).toFixed(1)),
          fullVal: monthlyPayroll,
        },
      ];
    }
    return [];
  }, [safeRuns, monthlyPayroll]);

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: "12px",
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-purple-500" />
            <h3 className="font-semibold text-base text-foreground">
              Payroll History & Forecast (in ₹ Lakhs)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Monthly compensation disbursement curve from live payroll runs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-purple-600 bg-purple-500/10 border-purple-500/30">
            Current: {fmtMoney(monthlyPayroll)}
          </Badge>
          <Link to="/payroll">
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
              <span>Payroll Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-[230px] w-full">
        {trendData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
            <DollarSign className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No payroll runs recorded</p>
            <p className="text-xs text-muted-foreground">Process monthly payroll runs to view compensation analytics and curves.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="L" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any) => [`₹${val} Lakhs`, "Disbursement"]}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#payrollGrad)"
                name="Payroll Total"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40 mt-2 text-center">
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Processed Runs
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">{safeRuns.length}</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Total Disbursed
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">
            {monthlyPayroll > 0 ? fmtMoney(monthlyPayroll) : "—"}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Disbursement Status
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">
            {safeRuns.length > 0 ? safeRuns[0].status || "Active" : monthlyPayroll > 0 ? "Configured" : "Inactive"}
          </div>
        </div>
      </div>
    </div>
  );
}
