import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Mail,
  Cpu,
  Save,
  Clock,
  HardDrive,
  Globe,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useGetSuperAdminSettingsQuery,
  useUpdateSuperAdminSettingsMutation,
} from "@/features/super-admin/api/superAdminApi";
import { toast } from "sonner";

export default function PlatformSettingsPage() {
  const { data: serverSettings, isLoading, refetch } = useGetSuperAdminSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSuperAdminSettingsMutation();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
  const [enforceMfaGlobally, setEnforceMfaGlobally] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState("60");
  const [defaultTrialDays, setDefaultTrialDays] = useState("14");
  const [emailSenderName, setEmailSenderName] = useState("OFC360 Enterprise");
  const [emailSenderAddress, setEmailSenderAddress] = useState("no-reply@ofc360.com");
  const [aiTokenRateLimitPerHour, setAiTokenRateLimitPerHour] = useState("50000");
  const [securityAlertEmail, setSecurityAlertEmail] = useState("security@ofc360.com");
  const [autoBackupIntervalHours, setAutoBackupIntervalHours] = useState("6");

  useEffect(() => {
    if (serverSettings) {
      setMaintenanceMode(serverSettings.maintenanceMode ?? false);
      setAllowNewRegistrations(serverSettings.allowNewRegistrations ?? true);
      setEnforceMfaGlobally(serverSettings.enforceMfaGlobally ?? true);
      setSessionTimeoutMinutes(String(serverSettings.sessionTimeoutMinutes ?? 60));
      setDefaultTrialDays(String(serverSettings.defaultTrialDays ?? 14));
      setEmailSenderName(serverSettings.emailSenderName ?? "OFC360 Enterprise");
      setEmailSenderAddress(serverSettings.emailSenderAddress ?? "no-reply@ofc360.com");
      setAiTokenRateLimitPerHour(String(serverSettings.aiTokenRateLimitPerHour ?? 50000));
      setSecurityAlertEmail(serverSettings.securityAlertEmail ?? "security@ofc360.com");
      setAutoBackupIntervalHours(String(serverSettings.autoBackupIntervalHours ?? 6));
    }
  }, [serverSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
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
      }).unwrap();

      toast.success("Global platform configuration saved and persisted to database.");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to save settings.");
    }
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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5 border-border/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Default Trial Period (Days)</Label>
                <Input
                  type="number"
                  value={defaultTrialDays}
                  onChange={(e) => setDefaultTrialDays(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">User Session Timeout (Minutes)</Label>
                <Input
                  type="number"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Global Authentication */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Security & Global Compliance</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Enforce Multi-Factor Authentication (MFA) Globally</p>
                <p className="text-[11px] text-muted-foreground">
                  Require all HR Administrators, Executives, and Platform Admins to use TOTP 2FA.
                </p>
              </div>
              <Switch checked={enforceMfaGlobally} onCheckedChange={setEnforceMfaGlobally} />
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold">Security Alert Dispatch Email</Label>
              <Input
                type="email"
                value={securityAlertEmail}
                onChange={(e) => setSecurityAlertEmail(e.target.value)}
                className="text-xs h-8"
              />
              <p className="text-[11px] text-muted-foreground">
                All suspicious login events, brute force attempts, and privilege escalations dispatch instant alerts here.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: AI Inference & System Operations */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">AI Copilot Rate Limits & Backups</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">AI Token Rate Limit (Tokens / Hour / Tenant)</Label>
              <Input
                type="number"
                value={aiTokenRateLimitPerHour}
                onChange={(e) => setAiTokenRateLimitPerHour(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Automated Database Snapshot Interval (Hours)</Label>
              <Input
                type="number"
                value={autoBackupIntervalHours}
                onChange={(e) => setAutoBackupIntervalHours(e.target.value)}
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>

        {/* Section 4: System Email Dispatch */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Mail className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">System Notification & Email Sender</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Sender Display Name</Label>
              <Input
                value={emailSenderName}
                onChange={(e) => setEmailSenderName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Sender Email Address</Label>
              <Input
                type="email"
                value={emailSenderAddress}
                onChange={(e) => setEmailSenderAddress(e.target.value)}
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}