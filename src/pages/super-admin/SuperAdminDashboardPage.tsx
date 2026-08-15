import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  DollarSign,
  ShieldAlert,
  Server,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Radio,
  FileCheck2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useSuperAdminStore } from "@/stores/superAdminStore";

const CHART_COLORS = [
  "#6366F1", // Indigo (Brand Primary)
  "#8B5CF6", // Violet (Brand Secondary)
  "#06B6D4", // Cyan (AI Accent)
  "#22C55E", // Emerald (Success)
  "#F59E0B", // Amber (Warning)
];

const customTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
};

export default function SuperAdminDashboardPage() {
  const { companies, users, hrAdmins, onboardingItems, subscriptions, securityEvents } = useSuperAdminStore();

  const totalMRR = useMemo(() => {
    return companies.reduce((acc, c) => acc + (c.mrr || 0), 0);
  }, [companies]);

  const totalEmployeesUnderManagement = useMemo(() => {
    return companies.reduce((acc, c) => acc + (c.employeeCount || 0), 0);
  }, [companies]);

  const activeCompanies = companies.filter((c) => c.status === "Active").length;
  const trialCompanies = companies.filter((c) => c.status === "Trial").length;

  const planDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      counts[c.plan] = (counts[c.plan] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [companies]);

  const hasPlanData = planDistribution.some((p) => p.value > 0);

  // Dynamically compute monthly revenue growth curve from real subscriptions/companies
  const revenueGrowthData = useMemo(() => {
    if (companies.length === 0) return [];
    
    // Group MRR and companies by created month
    const monthsMap: Record<string, { mrr: number; companies: number }> = {};
    companies.forEach((c) => {
      const month = c.createdAt ? new Date(c.createdAt).toLocaleString("en-US", { month: "short" }) : "Current";
      if (!monthsMap[month]) {
        monthsMap[month] = { mrr: 0, companies: 0 };
      }
      monthsMap[month].mrr += (c.mrr || 0);
      monthsMap[month].companies += 1;
    });

    const entries = Object.entries(monthsMap).map(([month, data]) => ({
      month,
      mrr: data.mrr,
      companies: data.companies,
    }));

    return entries.length > 0 ? entries : [{ month: "Current", mrr: totalMRR, companies: companies.length }];
  }, [companies, totalMRR]);

  const criticalSecurityEvents = securityEvents.filter((e) => e.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Master Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-tenant infrastructure overview, tenant performance, subscription billing, and security posture.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm">
            <Link to="/super-admin/companies">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Organization</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Managed Organizations</p>
            <div className="text-2xl font-bold text-foreground">{companies.length}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>{activeCompanies} Active · {trialCompanies} Trial</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Monthly Recurring Revenue</p>
            <div className="text-2xl font-bold text-foreground">
              ${totalMRR.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/mo</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              ARR: ${(totalMRR * 12).toLocaleString()}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Workforce Managed</p>
            <div className="text-2xl font-bold text-foreground">{totalEmployeesUnderManagement.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground">Across {hrAdmins.length} HR Administrators</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active Security Incidents</p>
            <div className="text-2xl font-bold text-foreground">{criticalSecurityEvents}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Global MFA Enforced</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* MRR & Tenant Growth Trend */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue & Platform Growth Curve</h3>
              <p className="text-xs text-muted-foreground">Monthly Recurring Revenue growth trajectory across all tenants</p>
            </div>
            {companies.length > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[11px]">
                Live Revenue
              </Badge>
            )}
          </div>

          <div className="h-64 w-full">
            {revenueGrowthData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No data available for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]} />
                  <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Plan Tier Distribution */}
        <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Subscription Tier Distribution</h3>
            <p className="text-xs text-muted-foreground">Tier allocation across enterprise workspaces</p>
          </div>

          <div className="h-48 w-full">
            {!hasPlanData ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No data available for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-center">
            {planDistribution.map((item, idx) => (
              <div key={item.name} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <p className="text-xs font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Overview Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Active Organization Workspaces</h3>
            <p className="text-xs text-muted-foreground">Live tenant status, assigned administrators, and employee volumes</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary gap-1">
            <Link to="/super-admin/companies">
              <span>View All ({companies.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Company</TableHead>
                <TableHead className="text-xs font-semibold">Plan</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Headcount</TableHead>
                <TableHead className="text-xs font-semibold">Primary HR Admin</TableHead>
                <TableHead className="text-xs font-semibold">MRR</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No companies registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                companies.slice(0, 5).map((comp) => (
                  <TableRow key={comp.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">{comp.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{comp.domain}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {comp.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          comp.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : comp.status === "Trial"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {comp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {comp.employeeCount} staff
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs text-foreground font-medium">{comp.hrAdminName}</p>
                        <p className="text-[11px] text-muted-foreground">{comp.hrAdminEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${comp.mrr.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-primary">
                        <Link to={`/super-admin/companies`}>Manage</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
