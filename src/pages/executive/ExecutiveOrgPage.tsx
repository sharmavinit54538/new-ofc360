import { useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Users, MapPin, TrendingUp, Layers, PieChart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";

export default function ExecutiveOrgPage() {
  const { data: rawEmployees = [], isLoading: isEmployeesLoading } = useGetEmployeesQuery();
  const { data: rawDepts = [], isLoading: isDeptsLoading } = useGetDepartmentsQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const departments = Array.isArray(rawDepts) ? rawDepts : [];

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (employees.length > 0) {
      employees.forEach((emp) => {
        const dept = emp.department?.trim() || "General";
        counts[dept] = (counts[dept] || 0) + 1;
      });
    } else if (departments.length > 0) {
      departments.forEach((d) => {
        counts[d.name] = d.employeeCount || 0;
      });
    }
    return counts;
  }, [employees, departments]);

  const totalEmployees = employees.length;
  const totalDivisions = Object.keys(deptCounts).length || departments.length || 0;

  if (isEmployeesLoading || isDeptsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading organizational workforce metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span>Organization Structure & Composition</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          High-level organizational breakdown across departments, geographical hubs, and headcount growth.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Total Enterprise Headcount</span>
          <p className="text-2xl font-extrabold text-primary font-mono">{totalEmployees}</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Live Workforce Sync</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Functional Departments</span>
          <p className="text-2xl font-extrabold text-foreground font-mono">{totalDivisions} Divisions</p>
          <span className="text-[11px] text-muted-foreground">Synchronized Department Graph</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Workforce Hubs</span>
          <p className="text-2xl font-extrabold text-purple-500 font-mono">Headquarters & Remote</p>
          <span className="text-[11px] text-muted-foreground">Multi-regional deployment</span>
        </div>
      </div>

      {/* Departmental Composition Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Departmental Workforce Breakdown</h3>

        {Object.keys(deptCounts).length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No department data available.
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Department Division</TableHead>
                  <TableHead className="text-xs font-bold">Headcount</TableHead>
                  <TableHead className="text-xs font-bold">Share of Total</TableHead>
                  <TableHead className="text-xs font-bold">Primary Location</TableHead>
                  <TableHead className="text-xs font-bold">Growth Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(deptCounts).map(([dept, count]) => {
                  const share = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                  return (
                    <TableRow key={dept}>
                      <TableCell className="font-bold text-xs text-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span>{dept}</span>
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold">{count}</TableCell>
                      <TableCell className="text-xs font-mono">{share}%</TableCell>
                      <TableCell className="text-xs text-muted-foreground">HQ & Remote</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px]">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}