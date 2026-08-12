import { motion } from "framer-motion";
import {
  Building2,
  Users,
  ShieldCheck,
  UserPlus,
  DollarSign,
  ArrowRight,
  Globe,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TalentIntelligenceCard } from "@/components/talent-intelligence/TalentIntelligenceCard";
import { useSuperAdminStore } from "@/stores/superAdminStore";

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
  const { companies, users, hrAdmins, onboardingItems, subscriptions } = useSuperAdminStore();

  const totalMRR = companies.reduce((sum, c) => sum + c.mrr, 0);

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
            <p className="text-lg font-bold text-foreground">{companies.length}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total Users</p>
            <p className="text-lg font-bold text-foreground">{users.length}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">HR Administrators</p>
            <p className="text-lg font-bold text-foreground">{hrAdmins.length}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Contracted MRR</p>
            <p className="text-lg font-bold text-emerald-600">${totalMRR.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
