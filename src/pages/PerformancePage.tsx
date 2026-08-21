import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Star, Users, Brain } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function PerformancePage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const totalEmployees = employees.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Performance & OKRs</h1>
        <p className="page-subheader">Workforce performance tracking, KPI attainment & goal management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Tracked Workforce" value={String(totalEmployees)} change="Registered staff" changeType="up" icon={Users} />
        <StatCard title="Active Appraisal Cycle" value={totalEmployees > 0 ? "Q3 2026" : "None"} change={totalEmployees > 0 ? "Cycle in progress" : "No active reviews"} changeType="up" icon={Target} />
        <StatCard title="Goal Completion" value={totalEmployees > 0 ? "—" : "0%"} change="Target tracking" changeType="neutral" icon={TrendingUp} />
        <StatCard title="Recognitions" value="0" change="This quarter" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skill Assessment */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Skill Competency Radar
          </h3>
          <div className="h-[240px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
            <Brain className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No competency evaluations recorded</p>
            <p className="text-xs text-muted-foreground">Competency radar will render once 360-degree appraisals are submitted.</p>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Quarterly Performance Trends
          </h3>
          <div className="h-[240px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
            <Target className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No historical review trends</p>
            <p className="text-xs text-muted-foreground">Quarterly score history will be logged after appraisal cycle completion.</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="glass-card rounded-xl p-5 border border-border/50">
        <h3 className="font-semibold text-sm mb-4">Key Performance Indicators</h3>
        <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
          No organizational KPIs defined for the current cycle. Configure company OKRs and key results to track attainment percentages.
        </div>
      </div>
    </motion.div>
  );
}