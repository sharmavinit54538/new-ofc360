import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target, Award, Heart, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveKPIsPage() {
  const kpis = [
    { title: "Total Headcount", value: "55", sub: "+3.2% vs last qtr", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Headcount Growth Rate", value: "12.5%", sub: "Annualized rate", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Attrition Rate", value: "4.2%", sub: "Low benchmark", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Retention Rate", value: "95.8%", sub: "Top tier stability", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Attendance Rate", value: "96.4%", sub: "Org average", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Employee Engagement Index", value: "8.8 / 10", sub: "Pulse survey score", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Performance Score", value: "91.2%", sub: "Quarterly OKR goal output", icon: Target, color: "text-teal-500", bg: "bg-teal-500/10" },
    { title: "Hiring Velocity", value: "14 Days", sub: "Time to fill open requisition", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Open Positions", value: "8 Reqs", sub: "Active recruitment", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Monthly Payroll Cost", value: "$450,000", sub: "Budgeted compensation", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Revenue Per Employee", value: "$18,500", sub: "Monthly efficiency", icon: DollarSign, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Workforce Productivity", value: "94.0%", sub: "Aggregated output score", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <span>Executive Organization KPI Matrix</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Strategic metrics, headcount growth, productivity indicators, and compensation benchmarks.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              whileHover={{ y: -2 }}
              className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] gap-0.5 border-emerald-500/30 text-emerald-500 font-mono">
                  <ArrowUpRight className="w-3 h-3" /> Target Met
                </Badge>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground">{kpi.title}</span>
                <p className="text-2xl font-extrabold text-foreground font-mono mt-0.5">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{kpi.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}