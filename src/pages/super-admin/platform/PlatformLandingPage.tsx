import {
  Building2,
  Users,
  ShieldCheck,
  UserPlus,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { TalentIntelligenceCard } from "@/components/talent-intelligence/TalentIntelligenceCard";
import { useGetSuperAdminDashboardQuery } from "@/services/api/superAdminApi";
import { Button } from "@/components/ui/button";

const platformModules = [
  {
    title: "Companies & Workspaces",
    description: "Multi-tenant organization directory, tenant status, plan configurations, storage metrics, and workspace provisioning.",
    icon: Building2,
    path: "/super-admin/companies",
    tag: "Workspaces",
  },
  {
    title: "Platform Users Directory",
    description: "Cross-tenant global user directory, system role matrices, authentication status, and credential resets.",
    icon: Users,
    path: "/super-admin/users",
    tag: "Directory",
  },
  {
    title: "HR Administrators",
    description: "Directory of tenant primary HR administrators, setup status, workspace assignments, and contact channels.",
    icon: ShieldCheck,
    path: "/super-admin/hr-admins",
    tag: "Admins",
  },
  {
    title: "Onboarding Pipeline",
    description: "Track pending enterprise workspace setups, stage verification, document uploads, and fast-track approvals.",
    icon: UserPlus,
    path: "/super-admin/onboarding",
    tag: "Pipeline",
  },
  {
    title: "Subscriptions & Billing",
    description: "Manage organization subscription tiers, billing renewal schedules, seat license limits, and contract values.",
    icon: DollarSign,
    path: "/super-admin/subscriptions",
    tag: "Billing",
  },
];

export default function PlatformLandingPage() {
  const { data: dashboardData, isLoading, isFetching, refetch } = useGetSuperAdminDashboardQuery();

  const kpis = dashboardData?.kpis;
  const financials = dashboardData?.financials;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Centralized administration for enterprise workspaces, users, HR administrators, tenant onboarding, and SaaS subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5 border-border/60"
            disabled={isFetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformModules.map((mod) => (
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

      {/* Overview Stats Footer Card */}
      <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
        <h4 className="font-bold text-sm text-foreground">
          Platform Summary Statistics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Workspaces</p>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : kpis?.total_organizations ?? 0}
            </p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total Users</p>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : kpis?.total_users ?? 0}
            </p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">HR Administrators</p>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : kpis?.total_hr_admins ?? 0}
            </p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Monthly Recurring Revenue</p>
            <p className="text-lg font-bold text-foreground text-emerald-600">
              {isLoading ? "—" : `$${(financials?.mrr ?? 0).toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}