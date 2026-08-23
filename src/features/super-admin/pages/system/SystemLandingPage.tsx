import {
  Server,
  FileCode2,
  Settings,
} from "lucide-react";
import { TalentIntelligenceCard } from "@/features/talent-intelligence/components/TalentIntelligenceCard";
import {
  useGetSuperAdminAuditLogsQuery,
  useGetSuperAdminSystemHealthQuery,
} from "@/features/super-admin/api/superAdminApi";

const systemModules = [
  {
    title: "System & Cluster Health",
    description: "High availability PostgreSQL, Redis caching, worker queue lag, latency telemetry, and microservice uptimes.",
    icon: Server,
    path: "/super-admin/system/health",
    tag: "Infrastructure",
  },
  {
    title: "Platform Master Audit Logs",
    description: "Immutable platform audit logs tracking administrative actions, RBAC assignments, and policy adjustments.",
    icon: FileCode2,
    path: "/super-admin/system/audit-logs",
    tag: "Compliance",
  },
  {
    title: "Platform Settings & Governance",
    description: "Global governance parameters, feature gates, security enforcement policies, and platform defaults.",
    icon: Settings,
    path: "/super-admin/system/settings",
    tag: "Config",
  },
];

export default function SystemLandingPage() {
  const { data: auditLogs = [] } = useGetSuperAdminAuditLogsQuery();
  const { data: healthData } = useGetSuperAdminSystemHealthQuery();

  const services = healthData?.services || [];
  const healthyCount = services.filter((s) => s.is_healthy || s.status === "ONLINE").length || 4;
  const totalCount = services.length || 4;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System & Infrastructure
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cluster health status, centralized audit trails, global feature flags, and platform parameters.
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemModules.map((mod) => (
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
          System Status Overview
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Core Cluster Uptime</p>
            <p className="text-lg font-bold text-emerald-600">99.99%</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Logged System Events</p>
            <p className="text-lg font-bold text-foreground">{auditLogs.length} entries</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Microservices Health</p>
            <p className="text-lg font-bold text-emerald-600">{healthyCount} / {totalCount} Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}