import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { PieChart as PieChartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
];

interface DepartmentChartProps {
  departmentSplit: { name: string; value: number }[];
}

export function DashboardDepartmentChart({ departmentSplit }: DepartmentChartProps) {
  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: "12px",
  };

  const total = departmentSplit.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base text-foreground">Department Allocation</h3>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {departmentSplit.length} Departments
        </Badge>
      </div>

      {departmentSplit.length > 0 ? (
        <>
          <div className="relative h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentSplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {departmentSplit.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-foreground">{total}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Staff
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2 justify-center max-h-24 overflow-y-auto">
            {departmentSplit.map((d, i) => {
              const percent = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div
                  key={d.name}
                  className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/40 border border-border/30"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-medium text-foreground truncate max-w-[90px]">
                    {d.name}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    ({d.value} • {percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[220px] text-center p-6 space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/20">
          <PieChartIcon className="w-10 h-10 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No department allocation</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Department headcount splits will visualize here once employees are registered in departments.
            </p>
          </div>
          <Link to="/people">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
              <span>Add Employees</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
