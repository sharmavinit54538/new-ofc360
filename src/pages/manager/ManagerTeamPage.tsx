import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Clock, UserCheck, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useAuth } from "@/hooks/useAuth";

export default function ManagerTeamPage() {
  const { employees } = useEmployeeStore();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Filter employees belonging to manager's team / department
  const myTeam = employees.filter((emp) => {
    const matchesTeam =
      emp.department === user?.department ||
      emp.role.toLowerCase().includes("engineer") ||
      emp.role.toLowerCase().includes("developer") ||
      emp.role.toLowerCase().includes("designer") ||
      emp.department === "Engineering";
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>My Team Directory</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of direct reports, roles, contact details, and attendance status.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-secondary/30 h-9"
          />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Direct Team Members</span>
          <p className="text-2xl font-extrabold text-primary font-mono">{myTeam.length}</p>
          <span className="text-[11px] text-muted-foreground">Reporting to Manager</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Present Today</span>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">
            {myTeam.filter((e) => e.status === "Active").length}
          </p>
          <span className="text-[11px] text-muted-foreground">Checked in / On Duty</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">On Leave Today</span>
          <p className="text-2xl font-extrabold text-amber-500 font-mono">0</p>
          <span className="text-[11px] text-muted-foreground">Scheduled Time-off</span>
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Direct Reports Roster</h3>

        {myTeam.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No direct team members found in your department scope.
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Employee Name</TableHead>
                  <TableHead className="text-xs font-bold">Designation</TableHead>
                  <TableHead className="text-xs font-bold">Department</TableHead>
                  <TableHead className="text-xs font-bold">Email</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTeam.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-bold text-xs text-foreground flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 border border-primary/20 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {(emp.name || "Employee").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "E"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{emp.name || "Employee"}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{emp.role}</TableCell>
                    <TableCell className="text-xs font-semibold">{emp.department}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{emp.email}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px]">
                        {emp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
