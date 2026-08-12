import { useState } from "react";
import { motion } from "framer-motion";
import { Key, ShieldCheck, Lock, Globe, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SSOPage() {
  const [ssoProvider, setSsoProvider] = useState("azure_ad");
  const [enforceSso, setEnforceSso] = useState(true);
  const [domain, setDomain] = useState("ofc360.com");
  const [metadataUrl, setMetadataUrl] = useState("https://auth.ofc360.com/saml/v2/metadata.xml");

  const handleSaveSSO = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enterprise SSO Configuration updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <span>Single Sign-On (SSO) Enterprise Governance</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure SAML 2.0 and OpenID Connect (OIDC) identity provider federation for enterprise authentication.
        </p>
      </div>

      {/* Main Form */}
      <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-foreground">SAML 2.0 / OIDC Identity Provider</h3>
            <p className="text-xs text-muted-foreground">Federate login with your corporate Identity Provider (IdP)</p>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
            SAML Active
          </Badge>
        </div>

        <form onSubmit={handleSaveSSO} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="font-bold text-foreground">Enforce Mandatory SSO Login</p>
              <p className="text-[11px] text-muted-foreground">Require all users under verified domains to authenticate via SSO</p>
            </div>
            <Switch checked={enforceSso} onCheckedChange={setEnforceSso} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Identity Provider (IdP)</Label>
              <Select value={ssoProvider} onValueChange={setSsoProvider}>
                <SelectTrigger className="text-xs bg-secondary/30 h-9 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure_ad">Microsoft Azure Active Directory / Entra ID</SelectItem>
                  <SelectItem value="google_workspace">Google Workspace Enterprise SSO</SelectItem>
                  <SelectItem value="okta">Okta Workforce Identity</SelectItem>
                  <SelectItem value="onelogin">OneLogin SAML 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Verified Corporate Domain</Label>
              <Input placeholder="e.g. ofc360.com" value={domain} onChange={(e) => setDomain(e.target.value)} className="text-xs bg-secondary/30 h-9 font-mono" />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">IdP Metadata URL / Issuer Endpoint</Label>
            <Input placeholder="https://auth.ofc360.com/saml/v2/metadata.xml" value={metadataUrl} onChange={(e) => setMetadataUrl(e.target.value)} className="text-xs bg-secondary/30 h-9 font-mono text-foreground" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">Certificate Thumbprint (SHA-256)</Label>
            <Input value="••••••••••••SHA256_CERT_THUMBPRINT" disabled className="text-xs bg-muted/60 h-9 font-mono text-muted-foreground select-none" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">SAML Signing Key Secret</Label>
            <Input type="password" value="••••••••••••ENCRYPTED_SECRET" disabled className="text-xs bg-muted/60 h-9 font-mono select-none" />
            <p className="text-[10px] text-muted-foreground mt-0.5">Secrets and private keys are masked and encrypted at rest.</p>
          </div>

          <div className="pt-2">
            <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4" /> Save SSO Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
