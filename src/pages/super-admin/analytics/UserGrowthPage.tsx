import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  UserCheck,
  Building2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetSuperAdminUsersQuery,
  useGetSuperAdminOrganizationsQuery,
  useGetSuperAdminDashboardQuery,
} from "@/services/api/superAdminApi";

const customTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
};

export default function UserGrowthPage() {
  const { data: users = [] } = useGetSuperAdminUsersQuery();
  const { data: companies = [] } = useGetSuperAdminOrganizationsQuery();
  const { data: dashboard } = useGetSuperAdminDashboardQuery();

  const kpis = dashboard?.kpis;
  const totalHeadcount = kpis?.total_workforce_managed ?? kpis?.total_employees_count ?? 0;
  const avgUsersPerOrg = companies.length > 0 ? Math.round(users.length / companies.length) : 0;

  const userGrowthMonthly = useMemo(() => {
    if (users.length === 0) return [];

    const monthsMap: Record<string, number> = {};
    users.forEach((u) => {
      const month = u.createdAt ? new Date(u.createdAt).toLocaleString("en-US", { month: "short" }) : "Current";
      monthsMap[month] = (monthsMap[month] || 0) + 1;
    });

    let runningTotal = 0;
    return Object.entries(monthsMap).map(([month, newUsers]) => {
      runningTotal += newUsers;
      return {
        month,
        totalUsers: runningTotal,
        newUsers,
        activeUsers: Math.round(runningTotal * 0.85),
      };
    });
  }, [users]);

  const roleGrowthData = useMemo(() => {
    if (users.length === 0) return [];

    const roleCounts = {
      employee: users.filter((u) => u.role === "employee").length,
      manager: users.filter((u) => u.role === "manager").length,
      hr_admin: users.filter((u) => u.role === "hr_admin").length,
      executive: users.filter((u) => u.role === "executive" || u.role === ("cxo" as any)).length,
    };

    return [
      {
        category: "All Roles",
        employee: roleCounts.employee,
        manager: roleCounts.manager,
        hr_admin: roleCounts.hr_admin,
        executive: roleCounts.executive,
      },
    ];
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User & Workforce Growth
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-tenant user acquisition trajectory, role distributions, active user ratios, and retention curves.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Managed Headcount</p>
            <div className="text-2xl font-bold text-foreground">{totalHeadcount.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground">Across all corporate tenants</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Registered Users</p>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <p className="text-[11px] text-emerald-600 font-medium">
              {users.filter((u) => u.is_active || u.status === "Active").length} active accounts
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Avg. Users / Organization</p>
            <div className="text-2xl font-bold text-foreground">{avgUsersPerOrg}</div>
            <p className="text-[11px] text-muted-foreground">Across {companies.length} organizations</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cumulative User Growth Curve */}
        <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">User Acquisition Curve</h3>
            <p className="text-xs text-muted-foreground">Total registered platform users over time</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="totalUsers" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Roles */}
        <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Active User Role Distribution</h3>
            <p className="text-xs text-muted-foreground">Distribution across Employee, Manager, HR Admin, and Executive roles</p>
          </div>

          <div className="h-64 w-full">
            {roleGrowthData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No role data recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="employee" name="Employees" fill="#6366F1" />
                  <Bar dataKey="manager" name="Managers" fill="#8B5CF6" />
                  <Bar dataKey="hr_admin" name="HR Admins" fill="#06B6D4" />
                  <Bar dataKey="executive" name="Executives" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown per Organization */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Organization User Volume</h3>
          <p className="text-xs text-muted-foreground">Active registered accounts by enterprise tenant</p>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Plan</TableHead>
                <TableHead className="text-xs font-semibold">Total Staff</TableHead>
                <TableHead className="text-xs font-semibold">Registered Accounts</TableHead>
                <TableHead className="text-xs font-semibold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                    No organization user distributions recorded.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((c) => {
                  const companyUserCount = users.filter((u) => u.companyId === c.id || u.companyName === c.name || u.company_id === c.id).length;
                  return (
                    <TableRow key={c.id} className="hover:bg-secondary/30 transition-colors">
                      <TableCell className="text-xs font-bold text-foreground">
                        {c.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {c.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.employeeCount ?? c.employee_count ?? 0} employees
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {companyUserCount} accounts
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={`text-[10px] ${
                            c.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}