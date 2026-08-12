import { motion } from "framer-motion";
import { Building2, Users, MapPin, TrendingUp, Layers, PieChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployeeStore } from "@/stores/employeeStore";

export default function ExecutiveOrgPage() {
  const { employees } = useEmployeeStore();

  const deptCounts: Record<string, number> = {
    Engineering: 18,
    Product: 8,
    Marketing: 6,
    Sales: 12,
    Operations: 7,
    HR: 4,
  };

  const totalEmployees = employees.length > 0 ? employees.length : 55;

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
          <span className="text-[11px] text-emerald-500 font-semibold">+12.5% YoY Growth</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Functional Departments</span>
          <p className="text-2xl font-extrabold text-foreground font-mono">6 Divisions</p>
          <span className="text-[11px] text-muted-foreground">Engineering, Product, Sales, Ops</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Workforce Locations</span>
          <p className="text-2xl font-extrabold text-purple-500 font-mono">3 Hubs</p>
          <span className="text-[11px] text-muted-foreground">HQ, West Regional, Distributed Remote</span>
        </div>
      </div>

      {/* Departmental Composition Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Departmental Workforce Breakdown</h3>

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
                const share = Math.round((count / 55) * 100);
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
                        Expanding
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
