import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Lock,
  Mail,
  Cpu,
  Save,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HardDrive,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSuperAdminStore } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function PlatformSettingsPage() {
  const { settings, updateSettings } = useSuperAdminStore();

  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(settings.allowNewRegistrations);
  const [enforceMfaGlobally, setEnforceMfaGlobally] = useState(settings.enforceMfaGlobally);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(String(settings.sessionTimeoutMinutes));
  const [defaultTrialDays, setDefaultTrialDays] = useState(String(settings.defaultTrialDays));
  const [emailSenderName, setEmailSenderName] = useState(settings.emailSenderName);
  const [emailSenderAddress, setEmailSenderAddress] = useState(settings.emailSenderAddress);
  const [aiTokenRateLimitPerHour, setAiTokenRateLimitPerHour] = useState(String(settings.aiTokenRateLimitPerHour));
  const [securityAlertEmail, setSecurityAlertEmail] = useState(settings.securityAlertEmail);
  const [autoBackupIntervalHours, setAutoBackupIntervalHours] = useState(String(settings.autoBackupIntervalHours));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      maintenanceMode,
      allowNewRegistrations,
      enforceMfaGlobally,
      sessionTimeoutMinutes: parseInt(sessionTimeoutMinutes) || 60,
      defaultTrialDays: parseInt(defaultTrialDays) || 14,
      emailSenderName,
      emailSenderAddress,
      aiTokenRateLimitPerHour: parseInt(aiTokenRateLimitPerHour) || 50000,
      securityAlertEmail,
      autoBackupIntervalHours: parseInt(autoBackupIntervalHours) || 6,
    });

    toast.success("Global platform configuration saved successfully.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Settings & System Parameters
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Global governance parameters, feature gates, security enforcement policies, and platform defaults.
          </p>
        </div>

        <Button onClick={handleSave} className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm">
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Platform State & Governance */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Platform State & Registration</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Global Maintenance Mode</p>
                <p className="text-[11px] text-muted-foreground">
                  Temporarily lock out all non-super-admin users for scheduled database or core system updates.
                </p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Allow Self-Service Workspace Registration</p>
                <p className="text-[11px] text-muted-foreground">
                  Enable new corporate organizations to create trial workspaces via the public landing portal.
                </p>
              </div>
              <Switch checked={allowNewRegistrations} onCheckedChange={setAllowNewRegistrations} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Default Trial Period (Days)</Label>
                <Input
                  type="number"
                  value={defaultTrialDays}
                  onChange={(e) => setDefaultTrialDays(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Automated DB Backup Interval (Hours)</Label>
                <Input
                  type="number"
                  value={autoBackupIntervalHours}
                  onChange={(e) => setAutoBackupIntervalHours(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Authentication Defaults */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Security & Session Policies</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Enforce Multi-Factor Authentication (MFA)</p>
                <p className="text-[11px] text-muted-foreground">
                  Require all HR Admins and Super Administrators to configure TOTP authenticator app or security key.
                </p>
              </div>
              <Switch checked={enforceMfaGlobally} onCheckedChange={setEnforceMfaGlobally} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Session Inactivity Timeout (Minutes)</Label>
                <Input
                  type="number"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Security Alert Dispatch Email</Label>
                <Input
                  type="email"
                  value={securityAlertEmail}
                  onChange={(e) => setSecurityAlertEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Engine & Communications Gateway */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">AI Token Throttle & Email Gateway</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Sender Name</Label>
              <Input
                value={emailSenderName}
                onChange={(e) => setEmailSenderName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Sender Address</Label>
              <Input
                type="email"
                value={emailSenderAddress}
                onChange={(e) => setEmailSenderAddress(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">AI Token Rate Limit per Tenant (Tokens / Hour)</Label>
              <Input
                type="number"
                value={aiTokenRateLimitPerHour}
                onChange={(e) => setAiTokenRateLimitPerHour(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gradient-bg text-primary-foreground h-10 px-6 font-semibold shadow-md">
            Save All Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
