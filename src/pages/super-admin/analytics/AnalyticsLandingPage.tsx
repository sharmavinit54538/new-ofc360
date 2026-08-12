import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Globe,
  Layers
} from "lucide-react";
import { TalentIntelligenceCard } from "@/components/talent-intelligence/TalentIntelligenceCard";
import { useSuperAdminStore } from "@/stores/superAdminStore";

const analyticsModules = [
  {
    title: "Platform Usage & Telemetry",
    description: "Real-time API traffic consumption, module penetration rates, compute throughput, and tenant storage footprint.",
    icon: Activity,
    path: "/super-admin/analytics/usage",
    tag: "Usage",
  },
  {
    title: "User & Workforce Growth",
    description: "Historical user acquisition, role distributions, retention curves, and organizational headcount trajectory.",
    icon: TrendingUp,
    path: "/super-admin/analytics/user-growth",
    tag: "Growth",
  },
  {
    title: "Company & Tenant Expansion",
    description: "Tenant acquisition rates, industry segmentation, expansion revenue (NRR), and geographic distribution.",
    icon: PieChartIcon,
    path: "/super-admin/analytics/company-growth",
    tag: "Expansion",
  },
];

export default function AnalyticsLandingPage() {
  const { companies, users } = useSuperAdminStore();
  const totalEmployees = useMemo(() => {
    return companies.reduce((acc, c) => acc + (c.employeeCount || 0), 0);
  }, [companies]);

  const activeUsers = useMemo(() => {
    return users.filter((u) => u.status === "Active").length;
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Analytics & Insights
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deep telemetry into platform compute consumption, cross-tenant user growth, and market expansion metrics.
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsModules.map((mod) => (
          <TalentIntelligenceCard
            key={mod.title}
            title={mod.title}
            description={mod.description}
            icon={mod.icon}
            path={mod.path}
            tag={mod.tag}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
        <h4 className="font-bold text-sm text-foreground">
          Analytics Highlights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Active DAU / Registered</p>
            <p className="text-lg font-bold text-foreground">{activeUsers} / {users.length}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Tenant Retention</p>
            <p className="text-lg font-bold text-emerald-600">{companies.length > 0 ? "100.0%" : "0.0%"}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Managed Workforce</p>
            <p className="text-lg font-bold text-foreground">{totalEmployees.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
