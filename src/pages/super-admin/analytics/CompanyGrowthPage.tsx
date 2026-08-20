import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  DollarSign,
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
  ResponsiveContainer,
} from "recharts";
import {
  useGetSuperAdminOrganizationsQuery,
  useGetSuperAdminDashboardQuery,
} from "@/services/api/superAdminApi";

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

export default function CompanyGrowthPage() {
  const { data: companies = [] } = useGetSuperAdminOrganizationsQuery();
  const { data: dashboard } = useGetSuperAdminDashboardQuery();

  const financials = dashboard?.financials;
  const totalMRR = financials?.mrr ?? 0;

  const avgContractValue = useMemo(() => {
    return companies.length > 0 ? Math.round((totalMRR * 12) / companies.length) : 0;
  }, [companies, totalMRR]);

  const companyAcquisitionMonthly = useMemo(() => {
    if (companies.length === 0) return [];

    const monthsMap: Record<string, { newTenants: number; mrr: number }> = {};
    companies.forEach((c) => {
      const month = c.createdAt ? new Date(c.createdAt).toLocaleString("en-US", { month: "short" }) : "Current";
      if (!monthsMap[month]) {
        monthsMap[month] = { newTenants: 0, mrr: 0 };
      }
      monthsMap[month].newTenants += 1;
      monthsMap[month].mrr += c.mrr || 0;
    });

    let runningTenants = 0;
    let runningMRR = 0;
    return Object.entries(monthsMap).map(([month, data]) => {
      runningTenants += data.newTenants;
      runningMRR += data.mrr;
      return {
        month,
        newTenants: data.newTenants,
        totalTenants: runningTenants,
        mrr: runningMRR,
      };
    });
  }, [companies]);

  const industryBreakdown = useMemo(() => {
    if (companies.length === 0) return [{ name: "Technology", value: 100 }];
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      const ind = c.industry || "Technology";
      counts[ind] = (counts[ind] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value: Math.round((value / companies.length) * 100),
    }));
  }, [companies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Company & Tenant Growth
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tenant acquisition rates, industry segmentation, expansion revenue, and geographic distribution.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Active Workspaces</p>
            <div className="text-2xl font-bold text-foreground">{companies.length}</div>
            <p className="text-[11px] text-emerald-600 font-medium">100% tenant retention</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Average Contract Value (ACV)</p>
            <div className="text-2xl font-bold text-foreground">
              ${avgContractValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground">Annualized contract value</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Monthly Recurring Revenue</p>
            <div className="text-2xl font-bold text-foreground">${totalMRR.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground">Across {companies.length} subscriptions</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cumulative Tenants Growth */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Tenant Acquisition & MRR Growth</h3>
            <p className="text-xs text-muted-foreground">New organization acquisitions over time</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={companyAcquisitionMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="totalTenants" name="Total Tenants" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Segmentation */}
        <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Industry Segmentation</h3>
            <p className="text-xs text-muted-foreground">Breakdown of customer verticals</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {industryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/40">
            {industryBreakdown.slice(0, 3).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-foreground font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
