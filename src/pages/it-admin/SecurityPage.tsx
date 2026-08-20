import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, AlertTriangle, Key, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SecurityPage() {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [passLength, setPassLength] = useState(8);
  const [lockoutThreshold, setLockoutThreshold] = useState(5);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security & Password Policy configurations saved!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <span>Security Administration & MFA Enforcement</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure Multi-Factor Authentication (MFA), password complexity rules, lockout parameters, and IP security.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card space-y-6 shadow-sm">
        <h3 className="font-bold text-sm text-foreground">Global Enterprise Security Rules</h3>

        <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="font-bold text-foreground">Mandatory Multi-Factor Authentication (MFA)</p>
              <p className="text-[11px] text-muted-foreground">Require TOTP Authenticator app or FIDO2 hardware keys for all accounts</p>
            </div>
            <Switch checked={mfaEnforced} onCheckedChange={setMfaEnforced} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="font-bold text-foreground">Restrict Login to Corporate IP Whitelist</p>
              <p className="text-[11px] text-muted-foreground">Deny authentication attempts outside authorized VPN / IP subnets</p>
            </div>
            <Switch checked={ipWhitelisting} onCheckedChange={setIpWhitelisting} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Minimum Password Length</Label>
              <Input
                type="number"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="text-xs bg-secondary/30 h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Failed Login Lockout Threshold</Label>
              <Input
                type="number"
                value={lockoutThreshold}
                onChange={(e) => setLockoutThreshold(Number(e.target.value))}
                className="text-xs bg-secondary/30 h-9 font-mono"
              />
              <p className="text-[10px] text-muted-foreground">Lock account for 15 minutes after 5 consecutive failed attempts.</p>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4" /> Apply Security Policy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}