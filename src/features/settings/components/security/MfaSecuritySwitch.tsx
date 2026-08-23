import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export function MfaSecuritySwitch({ mfaEnabled, disabled, onToggle }: { mfaEnabled: boolean; disabled: boolean; onToggle: (c: boolean) => void }) {
  return (
    <div className="pt-4 border-t border-border/30 flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground">Two-Factor Authentication (2FA / MFA)</p>
          <Badge variant={mfaEnabled ? "default" : "outline"} className={`text-[10px] ${mfaEnabled ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : ""}`}>{mfaEnabled ? "Enabled" : "Disabled"}</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">Require a time-based one-time verification code (TOTP) from Google Authenticator or Authy during admin login.</p>
      </div>
      <Switch checked={mfaEnabled} disabled={disabled} onCheckedChange={onToggle} />
    </div>
  );
}
