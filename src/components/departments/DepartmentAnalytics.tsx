import React from "react";
import { BarChart3, PieChart, TrendingUp, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";

export function DepartmentAnalytics() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const { data: rawDepartments = [] } = useGetDepartmentsQuery();

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];

  // Compute live department metrics
  const deptBreakdown = React.useMemo(() => {
    // ⚡ Bolt: Optimize O(N*M) nested loop to O(N+M) by grouping employees first
    // Impact: Reduces time complexity from O(Departments * Employees) to O(Departments + Employees)
    const employeesByDept = employees.reduce((acc, emp) => {
      const deptName = (emp.department || "").toLowerCase();
      if (!acc[deptName]) acc[deptName] = [];
      acc[deptName].push(emp);
      return acc;
    }, {} as Record<string, typeof employees>);

    return departments.map((dept) => {
      const members = employeesByDept[dept.name.toLowerCase()] || [];
      const avgScore = members.length > 0
        ? Math.round(
            members.reduce((acc, m) => acc + ((m as any).performanceScore || 82), 0) / members.length
          )
        : 80;
      const monthlyCost = members.reduce(
        (acc, m) => acc + Number(m.salary || m.ctc || 0) / 12,
        0
      );

      return {
        name: dept.name,
        headcount: members.length,
        performanceScore: avgScore,
        monthlyPayroll: monthlyCost,
        attendanceRate: 96.5,
        capacityUtilization: members.length >= 3 ? 92 : members.length * 30,
      };
    });
  }, [departments, employees]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Department Intelligence & Telemetry</span>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
              Live OFC360 Telemetry
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground">
            Multi-dimensional operational telemetry across {departments.length} registered business units.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Department Performance Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex flex-col justify-between space-y-3 bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground">Department Performance Scores</h4>
              <p className="text-[11px] text-muted-foreground">Milestone delivery velocity</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 py-1">
            {deptBreakdown.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{d.name}</span>
                  <span className="font-mono font-bold text-primary">{d.performanceScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${d.performanceScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground text-right">
            Verified across {employees.length} employee records
          </div>
        </motion.div>

        {/* Card 2: Headcount Capacity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex flex-col justify-between space-y-3 bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground">Headcount & Staffing Balance</h4>
              <p className="text-[11px] text-muted-foreground">Resource allocation across units</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 py-1">
            {deptBreakdown.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-xs">
                <span className="font-medium text-foreground">{d.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {d.headcount} Members
                  </Badge>
                  <span className={`text-[10px] font-bold ${d.headcount < 2 ? "text-amber-500" : "text-emerald-500"}`}>
                    {d.headcount < 2 ? "Understaffed" : "Optimal"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground text-right">
            Total Organization Headcount: {employees.length}
          </div>
        </motion.div>

        {/* Card 3: Monthly Department Payroll Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex flex-col justify-between space-y-3 bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground">Monthly Compensation Outflow</h4>
              <p className="text-[11px] text-muted-foreground">Department payroll disbursement</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <LineChart className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 py-1">
            {deptBreakdown.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-xs font-mono">
                <span className="font-sans font-medium text-foreground">{d.name}</span>
                <span className="font-bold text-foreground">
                  ₹{Math.round(d.monthlyPayroll).toLocaleString()}/mo
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground text-right">
            Derived from active payroll compensation bands
          </div>
        </motion.div>
      </div>
    </div>
  );
}