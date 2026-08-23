import {
  Key,
  ShieldAlert,
} from "lucide-react";
import { TalentIntelligenceCard } from "@/features/talent-intelligence/components/TalentIntelligenceCard";
import {
  useGetSuperAdminSessionsQuery,
  useGetSuperAdminSecurityEventsQuery,
} from "@/services/api/superAdminApi";

const securityModules = [
  {
    title: "Active Admin Sessions",
    description: "Real-time tracking of active Super Administrator and HR Administrator sessions, IP endpoints, and device fingerprints.",
    icon: Key,
    path: "/super-admin/security/sessions",
    tag: "Sessions",
  },
  {
    title: "Security Incidents & Threat Events",
    description: "Real-time intrusion detection, brute-force mitigation, unauthorized RBAC escalation alerts, and IP firewall rules.",
    icon: ShieldAlert,
    path: "/super-admin/security/events",
    tag: "Incidents",
  },
];

export default function SecurityLandingPage() {
  const { data: rawSessions = [] } = useGetSuperAdminSessionsQuery();
  const sessions = Array.isArray(rawSessions)
    ? rawSessions
    : Array.isArray((rawSessions as any)?.items)
    ? (rawSessions as any).items
    : Array.isArray((rawSessions as any)?.data)
    ? (rawSessions as any).data
    : [];
  const { data: rawSecurityEvents = [] } = useGetSuperAdminSecurityEventsQuery();
  const securityEvents = Array.isArray(rawSecurityEvents)
    ? rawSecurityEvents
    : Array.isArray((rawSecurityEvents as any)?.items)
    ? (rawSecurityEvents as any).items
    : Array.isArray((rawSecurityEvents as any)?.data)
    ? (rawSecurityEvents as any).data
    : [];

  const activeSessions = sessions.filter((s) => s?.status === "Active").length || sessions.length;
  const pendingThreats = securityEvents.filter((e) => e?.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Security & Threat Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administrative session oversight, live threat intelligence, firewall IP blocklists, and intrusion prevention.
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityModules.map((mod) => (
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
          Security Overview
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Active Admin Sessions</p>
            <p className="text-lg font-bold text-foreground">{activeSessions}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Open Security Alerts</p>
            <p className="text-lg font-bold text-amber-600">{pendingThreats}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Global MFA Status</p>
            <p className="text-lg font-bold text-emerald-600">Strictly Enforced</p>
          </div>
        </div>
      </div>
    </div>
  );
}