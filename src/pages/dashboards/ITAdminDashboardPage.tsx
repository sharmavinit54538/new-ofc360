import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  Monitor,
  ShieldCheck,
  Key,
  Lock,
  Cpu,
  Activity,
  FileCode2,
  Server,
  Zap,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ITAdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••OFC360_LIVE_KEY_9F8");

  const generateNewKey = () => {
    const newK = "••••••••••••OFC360_KEY_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setApiKey(newK);
    toast.success("New System API Key generated and encrypted.");
  };

  return (
    <RoleGuard allowedRoles={["it_admin", "hr_admin", "cxo"]}>
      <div className="space-y-6">

        {/* System Health Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">SSO Provider Status</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">SAML 2.0 Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Entra ID / Okta Connected</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Key className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">MFA Enforcement</p>
              <div className="text-lg font-bold text-foreground">Strict TOTP / FIDO2</div>
              <p className="text-[11px] text-muted-foreground">100% Policy Enforced</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Lock className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">System Health Uptime</p>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">99.99% Operational</div>
              <p className="text-[11px] text-muted-foreground">All Microservices Healthy</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">RBAC Matrix Status</p>
              <div className="text-lg font-bold text-foreground">5 Roles Defined</div>
              <p className="text-[11px] text-muted-foreground">Centralized Engine Active</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {/* Section 1: SSO & MFA Security Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* SSO Configuration Card */}
          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Single Sign-On (SSO) Config</h3>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                SAML 2.0 Enabled
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">Enforce SSO Authentication</p>
                  <p className="text-[11px] text-muted-foreground">Require SAML/OAuth login for corporate domain</p>
                </div>
                <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Identity Provider (IdP) Metadata URL</Label>
                <Input
                  readOnly
                  value="https://login.microsoftonline.com/ofc360/federationmetadata/2007-06/federationmetadata.xml"
                  className="h-9 text-xs font-mono bg-muted/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Allowed Corporate Domains</Label>
                <Input
                  readOnly
                  value="ofc360.com"
                  className="h-9 text-xs font-mono bg-muted/40"
                />
              </div>
            </div>
          </div>

          {/* MFA Configuration Card */}
          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Multi-Factor Auth (MFA)</h3>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Policy Enforced
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">Mandatory 2FA Policy</p>
                  <p className="text-[11px] text-muted-foreground">Enforce TOTP or WebAuthn hardware keys</p>
                </div>
                <Switch checked={mfaEnforced} onCheckedChange={setMfaEnforced} />
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <p className="font-semibold text-foreground">Supported Verification Factors:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px]">Authenticator App (TOTP)</Badge>
                  <Badge variant="outline" className="text-[10px]">FIDO2 / YubiKey Hardware</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: RBAC Matrix Quick Access & API Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* RBAC Overview Card */}
          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Role-Based Access Control</h3>
              </div>
              <Link to="/rbac">
                <Button size="sm" className="gradient-bg text-primary-foreground text-xs gap-1">
                  <span>Manage Matrix</span>
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Centralized permissions matrix for Employee, Manager, HR Admin, Executive CXO, and IT System Admin roles.
            </p>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Configured Roles:</span>
                <span className="font-bold text-foreground">5 System Roles</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Protected Modules:</span>
                <span className="font-bold text-foreground">15 Enterprise Modules</span>
              </div>
            </div>
          </div>

          {/* API Keys Card */}
          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">API Integrations & Keys</h3>
              </div>
              <Button size="sm" variant="outline" onClick={generateNewKey} className="h-8 text-xs gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Rotate Key
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <Label className="text-xs font-semibold">Active System Integration Key</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={apiKey} className="h-9 font-mono text-xs bg-muted/40" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Rate Limit: 10,000 req/min. Enforces TLS 1.3 encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Audit Logs & Security Telemetry Empty State */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-base font-bold text-foreground">Audit Logs & Security Stream</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              Real-time Logging Active
            </Badge>
          </div>

          <div className="p-8 text-center space-y-2">
            <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto" />
            <h4 className="text-sm font-bold text-foreground">Audit log stream idle</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              System authentication events, RBAC policy changes, and security telemetry will be streamed here in real time.
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
