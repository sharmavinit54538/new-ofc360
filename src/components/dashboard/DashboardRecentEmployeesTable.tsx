import { Users, UserPlus, ArrowRight, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { fmtMoney } from "@/utils/currency";

interface RecentEmployeesProps {
  employees: any[];
}

export function DashboardRecentEmployeesTable({ employees }: RecentEmployeesProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status?: string) => {
    const s = (status || "ACTIVE").toUpperCase();
    if (s === "ACTIVE") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          ACTIVE
        </span>
      );
    }
    if (s.includes("PENDING") || s.includes("ONBOARDING")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          ONBOARDING
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
        {s}
      </span>
    );
  };

  return (
    <div className="glass-card rounded-xl p-5 overflow-hidden border border-border/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-base text-foreground">Recent Employee Directory</h3>
            </div>
            <p className="text-xs text-muted-foreground">Live workforce personnel records & departments</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold">
              {employees.length} {employees.length === 1 ? "Employee" : "Employees"}
            </Badge>
            <Link to="/people">
              <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Employee</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.slice(0, 6).map((e) => {
                  const initials = e.name
                    ? e.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "EM";
                  return (
                    <TableRow key={e.id} className="hover:bg-secondary/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-foreground truncate">{e.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{e.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-secondary/60 text-foreground/90 font-medium text-[11px]">
                          {e.department || "Engineering"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(e.status)}</TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                        {fmtMoney(e.salary || 1200000)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 border border-dashed border-border/50 rounded-lg bg-muted/10 my-2">
            <Users className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">No employees registered</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Add staff members and executives in the People directory to populate live records.
              </p>
            </div>
            <Link to="/people">
              <Button size="sm" className="gradient-bg text-primary-foreground text-xs gap-1.5 h-8">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add First Employee</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing 6 most recently onboarded personnel</span>
        <Link to="/people" className="text-primary hover:underline font-medium">
          Manage Workforce Directory ➔
        </Link>
      </div>
    </div>
  );
}
