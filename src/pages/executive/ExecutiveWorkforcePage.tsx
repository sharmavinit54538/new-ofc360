import { motion } from "framer-motion";
import { Users, PieChart, TrendingUp, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ExecutiveWorkforcePage() {
  const departmentSplit = [
    { name: "Engineering & Tech", headcount: 18, share: 33, color: "bg-primary" },
    { name: "Sales & Account Execs", headcount: 12, share: 22, color: "bg-emerald-500" },
    { name: "Product Management", headcount: 8, share: 15, color: "bg-purple-500" },
    { name: "Operations & Logistics", headcount: 7, share: 13, color: "bg-amber-500" },
    { name: "Marketing & Growth", headcount: 6, share: 11, color: "bg-rose-500" },
    { name: "HR & Talent People Ops", headcount: 4, share: 6, color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Workforce Intelligence & Staffing Capacity</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Macro headcount analytics, department allocation, hiring vs exits ratio, and staffing trends.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Active Headcount</span>
          <p className="text-2xl font-extrabold text-foreground font-mono">55 Employees</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+18 Net Hires YTD</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Hiring vs Exits Ratio</span>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">18 : 2</p>
          <span className="text-[11px] text-muted-foreground">90% Net Retention Growth</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Staffing Capacity Utilization</span>
          <p className="text-2xl font-extrabold text-primary font-mono">92%</p>
          <span className="text-[11px] text-muted-foreground">Optimal Capacity Spread</span>
        </div>
      </div>

      {/* Department Allocation Grid */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Department Allocation & Capacity Share</h3>

        <div className="space-y-3">
          {departmentSplit.map((dept) => (
            <div key={dept.name} className="space-y-1.5 p-3 rounded-xl border border-border/40 bg-secondary/20">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <div className={`w-2.5 h-2.5 rounded-full ${dept.color}`} />
                  <span>{dept.name}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {dept.headcount} members ({dept.share}%)
                </span>
              </div>
              <Progress value={dept.share} className="h-2 bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
