import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Clock, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useATSStore } from "@/stores/atsStore";

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 };

export default function AnalyticsPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const { jobs = [], candidates = [] } = useATSStore();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e) => (e?.status || "").toUpperCase() === "ACTIVE"
  ).length;
  const openPositions = jobs.filter((j) => j?.status === "Published").length;

  // Real Department Distribution
  const departmentDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((e) => {
      const deptName = e?.department?.trim() || "General";
      counts[deptName] = (counts[deptName] || 0) + 1;
    });

    const colors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [employees]);

  // Real Hiring Funnel from live ATS
  const hiringFunnel = useMemo(() => {
    const stagesCount: Record<string, number> = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
    };

    candidates.forEach((c: any) => {
      const stage = c?.stage || c?.status;
      if (stage && stagesCount[stage] !== undefined) {
        stagesCount[stage] += 1;
      } else if (stage === "New" || stage === "Sourced") {
        stagesCount.Applied += 1;
      } else if (stage === "Technical Round" || stage === "Culture Round") {
        stagesCount.Interview += 1;
      }
    });

    return Object.entries(stagesCount).map(([stage, count]) => ({
      stage,
      count,
    }));
  }, [candidates]);

  // Real Headcount Trend
  const headcountTrend = useMemo(() => {
    if (totalEmployees === 0) return [];
    return [
      { month: "Registered", count: totalEmployees },
      { month: "Active", count: activeEmployees },
    ];
  }, [totalEmployees, activeEmployees]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Analytics & Reports</h1>
        <p className="page-subheader">Comprehensive workforce analytics, hiring reports & performance telemetry</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Workforce", value: String(totalEmployees), icon: Users, change: `${activeEmployees} active personnel`, up: true },
          { label: "Active Status Rate", value: totalEmployees > 0 ? `${Math.round((activeEmployees / totalEmployees) * 100)}%` : "0%", icon: UserCheck, change: "Active workforce ratio", up: true },
          { label: "Open Requisitions", value: String(openPositions), icon: Briefcase, change: `${jobs.length} total roles`, up: true },
          { label: "Candidate Pipeline", value: String(candidates.length), icon: Clock, change: "Active applications", up: true },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-muted-foreground">{s.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Department Distribution</CardTitle></CardHeader>
          <CardContent>
            {departmentDistribution.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg">
                No department distribution data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={departmentDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                    {departmentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Hiring Funnel Progression</CardTitle></CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg">
                No candidate applications in ATS funnel.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={hiringFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={80} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Headcount Breakdown */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Workforce Headcount Overview</CardTitle></CardHeader>
        <CardContent>
          {headcountTrend.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg">
              No employee headcount recorded.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={headcountTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={chartStyle} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Personnel" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}