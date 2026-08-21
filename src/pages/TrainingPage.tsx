import { motion } from "framer-motion";
import { BookOpen, Target, Award, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function TrainingPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Training & Skill Development</h1>
        <p className="page-subheader">Skill gap analysis, learning paths & organizational competencies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Personnel", value: String(employees.length), icon: BookOpen },
          { label: "Active Programs", value: "0", icon: Target },
          { label: "Certifications Issued", value: "0", icon: Award },
          { label: "Skill Benchmark", value: "—", icon: TrendingUp },
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Gap Radar */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Skill Gap Matrix</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
              <Brain className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold text-foreground">No skill gap analyses recorded</p>
              <p className="text-xs text-muted-foreground">Run a team skill assessment to identify training gaps and curriculum paths.</p>
            </div>
          </CardContent>
        </Card>

        {/* Growth Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Skill Progression Curve</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
              <TrendingUp className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold text-foreground">No progression data available</p>
              <p className="text-xs text-muted-foreground">Course completion metrics will be tracked here over time.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Assigned Learning Paths</CardTitle></CardHeader>
        <CardContent>
          <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
            No active learning tracks assigned to staff members.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}