import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, RefreshCw, CheckCircle2, ShieldCheck, Key, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  category: string;
  status: "Connected" | "Syncing" | "Healthy";
  maskedKey: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "int-1",
      name: "Slack & Microsoft Teams Notifications Webhook",
      category: "Communications",
      status: "Connected",
      maskedKey: "••••••••••••HOOK_SLACK_PROD_9F8",
    },
    {
      id: "int-2",
      name: "Enterprise Payroll Gateway API",
      category: "Payroll & Finance",
      status: "Healthy",
      maskedKey: "••••••••••••PAYROLL_API_SEC_331",
    },
    {
      id: "int-3",
      name: "AWS S3 Encrypted Document Storage Vault",
      category: "Cloud Infrastructure",
      status: "Healthy",
      maskedKey: "••••••••••••AWS_S3_VAULT_KEY_442",
    },
  ]);

  const handleSync = (name: string) => {
    toast.success(`Syncing API endpoints for ${name}...`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span>System Integrations & Webhooks</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage third-party API keys, communication webhooks, cloud storage, and payroll sync gateways.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Active Integration Gateways</h3>

        <div className="space-y-3">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                  <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span>API Secret Key:</span>
                  <span className="font-mono text-muted-foreground/90 hover:text-foreground transition-colors duration-250 select-all cursor-text px-1.5 py-0.5 rounded bg-muted/40 hover:bg-muted/70">
                    {item.maskedKey}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                  {item.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSync(item.name)}
                  className="h-8 text-xs gap-1 border-border/70 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Test Connection
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
