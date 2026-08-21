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
import { IndianRupee, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fmtMoney } from "@/utils/currency";

interface PayrollTrendChartProps {
  monthlyPayroll: number;
  runs: any[];
}

export function DashboardPayrollTrendChart({
  monthlyPayroll,
  runs,
}: PayrollTrendChartProps) {
  const defaultTrend = [
    { m: "Apr '26", v: 54, fullVal: 5400000 },
    { m: "May '26", v: 56, fullVal: 5600000 },
    { m: "Jun '26", v: 57.5, fullVal: 5750000 },
    { m: "Jul '26", v: 58.8, fullVal: 5880000 },
    { m: "Aug '26 (Current)", v: monthlyPayroll > 0 ? Number((monthlyPayroll / 100000).toFixed(1)) : 60.0, fullVal: monthlyPayroll || 6000000 },
    { m: "Sep '26 (Est.)", v: monthlyPayroll > 0 ? Number(((monthlyPayroll * 1.05) / 100000).toFixed(1)) : 63.0, fullVal: (monthlyPayroll || 6000000) * 1.05 },
  ];

  const trendData =
    runs.length > 0
      ? [...runs]
          .slice(0, 6)
          .reverse()
          .map((r) => ({
            m: `${r.month.slice(0, 3)} '${String(r.year).slice(-2)}`,
            v: Number((r.netTotal / 100000).toFixed(1)),
            fullVal: r.netTotal,
          }))
      : defaultTrend;

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
            Monthly gross compensation, deductions & disbursement curve
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
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40 mt-2 text-center">
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Net Salaries
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">85.4%</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            PF & ESI
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">10.2%</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            TDS / Tax
          </div>
          <div className="text-xs font-bold text-foreground mt-0.5">4.4%</div>
        </div>
      </div>
    </div>
  );
}
