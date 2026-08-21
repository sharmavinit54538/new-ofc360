import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Users, DollarSign, Sparkles, GitBranch, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useATSStore } from "@/stores/atsStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function HiringPlanningPage() {
  const { jobs = [], candidates = [] } = useATSStore();
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const openRolesCount = jobs.filter((j) => j?.status === "Published").length;
  const hiredCount = candidates.filter((c) => c?.stage === "Hired").length;

  const departmentPlans = useMemo(() => {
    const deptMap: Record<string, { open: number; totalCandidates: number }> = {};
    jobs.forEach((j) => {
      const dept = j?.department || "General";
      if (!deptMap[dept]) deptMap[dept] = { open: 0, totalCandidates: 0 };
      if (j.status === "Published") deptMap[dept].open += 1;
    });

    return Object.entries(deptMap).map(([department, data]) => ({
      department,
      openRoles: data.open,
      priority: data.open > 2 ? "high" : "medium",
    }));
  }, [jobs]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Hiring & Workforce Planning</h1>
          <p className="page-subheader">Headcount forecasting, departmental requisition budget & talent allocation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Requisitions", value: String(openRolesCount), icon: Briefcase },
          { label: "Candidates Hired", value: String(hiredCount), icon: Users },
          { label: "Total Workforce", value: String(employees.length), icon: TrendingUp },
          { label: "Total Requisitions", value: String(jobs.length), icon: DollarSign },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Plan */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Departmental Headcount Requisitions</CardTitle></CardHeader>
        <CardContent>
          {departmentPlans.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
              No active departmental hiring plans found. Create job requisitions in the Recruitment ATS module to populate workforce targets.
            </div>
          ) : (
            <div className="space-y-3">
              {departmentPlans.map((p) => (
                <div key={p.department} className="p-4 rounded-xl border border-border/50 bg-secondary/20 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{p.department}</p>
                    <p className="text-xs text-muted-foreground">{p.openRoles} Active Open Roles</p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{p.priority} Priority</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}