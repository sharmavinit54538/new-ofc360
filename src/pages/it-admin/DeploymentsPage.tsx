import { motion } from "framer-motion";
import { Cpu, CheckCircle2, ShieldCheck, RefreshCw, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DeploymentsPage() {
  const deployments = [
    {
      version: "v3.4.2-prod",
      timestamp: "Aug 11, 2026 14:20 UTC",
      environment: "Production (AWS US-East-1)",
      actor: "GitHub Actions CI/CD Pipeline",
      status: "Deployed Active",
      notes: "Feature updates for AI HR Document Generator & Role-Based Security Governance.",
    },
    {
      version: "v3.4.1-prod",
      timestamp: "Aug 05, 2026 09:15 UTC",
      environment: "Production (AWS US-East-1)",
      actor: "GitHub Actions CI/CD Pipeline",
      status: "Archived",
      notes: "Security patch for SAML 2.0 token expiration verification.",
    },
    {
      version: "v3.4.0-prod",
      timestamp: "Jul 28, 2026 18:00 UTC",
      environment: "Production (AWS US-East-1)",
      actor: "alex.vance@ofc360.com",
      status: "Archived",
      notes: "Major release for Resource Intelligence & Asset Management tracking.",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <span>Application Deployments & Release Management</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Production build versioning, CI/CD pipeline release logs, environment status, and rollback readiness.
        </p>
      </div>

      {/* Deployments List */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Deployment Release History</h3>

        <div className="space-y-3">
          {deployments.map((dep) => (
            <div key={dep.version} className="p-4 rounded-xl border border-border/60 bg-secondary/20 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">{dep.version}</span>
                  <Badge className={dep.status === "Deployed Active" ? "bg-emerald-500/15 text-emerald-500 text-[10px]" : "text-[10px]"}>
                    {dep.status}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{dep.timestamp}</span>
              </div>

              <p className="text-xs text-muted-foreground">{dep.notes}</p>
              <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
                <span>Environment: {dep.environment}</span>
                <span>Triggered By: {dep.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}