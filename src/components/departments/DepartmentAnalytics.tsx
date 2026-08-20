import { BarChart3, PieChart, TrendingUp, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export function DepartmentAnalytics() {
  const chartContainers = [
    {
      title: "Department Performance Score",
      subtitle: "Aggregate performance ratings across teams",
      icon: BarChart3,
    },
    {
      title: "Attendance & Utilization Rate",
      subtitle: "Departmental presence telemetry",
      icon: TrendingUp,
    },
    {
      title: "Workforce Capacity Distribution",
      subtitle: "Headcount seat allocation vs active staff",
      icon: PieChart,
    },
    {
      title: "Budget Allocation & Spending",
      subtitle: "Cost center budget variance",
      icon: LineChart,
    },
    {
      title: "Hiring & Requisition Velocity",
      subtitle: "Time-to-fill trend across departments",
      icon: TrendingUp,
    },
    {
      title: "Workforce Turnover Trajectory",
      subtitle: "Historical retention rates",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground">Department Analytics</h3>
          <p className="text-xs text-muted-foreground">Operational telemetry & capacity insights</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          Data Pipeline Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartContainers.map((chart, idx) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="glass-card rounded-xl p-6 border border-border/60 flex flex-col justify-between h-56 text-center"
          >
            <div className="flex items-center justify-between text-left mb-2">
              <div>
                <h4 className="text-xs font-bold text-foreground">{chart.title}</h4>
                <p className="text-[11px] text-muted-foreground">{chart.subtitle}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <chart.icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-dashed border-border/60 my-2">
              <p className="text-xs font-semibold text-foreground mb-1">Analytics unavailable</p>
              <p className="text-[11px] text-muted-foreground max-w-xs leading-tight">
                Department analytics will appear when sufficient organizational data is available.
              </p>
            </div>

            <div className="text-[10px] text-muted-foreground text-right italic">
              Awaiting dataset connection
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}