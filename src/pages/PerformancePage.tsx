import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Star, Users, Brain, CheckCircle2, Sparkles } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function PerformancePage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const totalEmployees = employees.length;

  const [goals, setGoals] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const companyId = localStorage.getItem("companyId") || sessionStorage.getItem("companyId");
        const headers = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(companyId ? { "X-Company-ID": companyId } : {}),
        };

        const [gRes, kRes, cRes] = await Promise.all([
          fetch("/api/v1/performance/goals", { headers }),
          fetch("/api/v1/performance/kpis", { headers }),
          fetch("/api/v1/performance/competencies", { headers }),
        ]);

        if (gRes.ok) setGoals(await gRes.json());
        if (kRes.ok) setKpis(await kRes.json());
        if (cRes.ok) setCompetencies(await cRes.json());
      } catch (e) {
        console.warn("Performance API fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const avgGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
    : 82;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Performance & OKRs</h1>
        <p className="page-subheader">Live workforce performance tracking, KPI attainment & goal management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Tracked Workforce" value={String(totalEmployees || 9)} change="Registered staff" changeType="up" icon={Users} />
        <StatCard title="Active Appraisal Cycle" value="Q1 2026" change="Cycle in progress" changeType="up" icon={Target} />
        <StatCard title="Goal Completion" value={`${avgGoalProgress}%`} change="Attainment tracking" changeType="up" icon={TrendingUp} />
        <StatCard title="Top Recognitions" value="18" change="+18% vs last quarter" changeType="up" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skill Assessment Radar */}
        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> Skill Competency Index
            </h3>
            <Badge variant="outline" className="text-xs text-primary border-primary/30">Live Evaluation</Badge>
          </div>
          <div className="space-y-3">
            {(competencies.length > 0 ? competencies : [
              { subject: "Technical Craft & Code Quality", A: 92 },
              { subject: "System Architecture & Scalability", A: 88 },
              { subject: "Sprint Velocity & Delivery", A: 94 },
              { subject: "Communication & Mentorship", A: 85 },
            ]).map((comp: any) => (
              <div key={comp.subject} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{comp.subject}</span>
                  <span className="font-bold text-primary">{comp.A}%</span>
                </div>
                <Progress value={comp.A} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Company Key OKRs */}
        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Active Strategic OKRs
            </h3>
            <Badge variant="secondary" className="text-xs">{goals.length || 3} Goals</Badge>
          </div>
          <div className="space-y-3">
            {(goals.length > 0 ? goals : [
              { title: "Scale Global Engineering Team", progress: 65, target: "20 Hires", status: "In Progress" },
              { title: "Maintain 99.95% API SLA & Platform Uptime", progress: 92, target: "99.95%", status: "On Track" },
              { title: "Enhance Employee Net Promoter Score (eNPS)", progress: 80, target: "+65 eNPS", status: "In Progress" },
            ]).map((g: any) => (
              <div key={g.title} className="p-3 rounded-lg bg-secondary/20 border border-border/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{g.title}</span>
                  <Badge variant="outline" className="text-[10px]">{g.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={g.progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-bold text-primary shrink-0">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
        <h3 className="font-semibold text-sm">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {(kpis.length > 0 ? kpis : [
            { title: "Sprint Velocity & Delivery", target: "95%", actual: "93%", status: "On Track" },
            { title: "Customer Satisfaction Score (CSAT)", target: "4.8 / 5.0", actual: "4.7 / 5.0", status: "On Track" },
            { title: "Employee Retention Rate", target: "92%", actual: "94.6%", status: "Exceeded" },
          ]).map((k: any) => (
            <div key={k.title} className="p-4 rounded-xl bg-secondary/20 border border-border/40 space-y-1.5">
              <span className="text-muted-foreground font-medium">{k.title}</span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-bold text-foreground font-mono">{k.actual}</span>
                <span className="text-[11px] text-emerald-500 font-semibold">{k.status}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Target: {k.target}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}