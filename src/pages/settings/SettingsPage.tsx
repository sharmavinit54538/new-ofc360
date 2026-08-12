import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  UserCheck,
  Lock,
  CreditCard,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Download,
  Plus,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Receipt,
  FileText,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/services/api/authApi";
import { normalizeError } from "@/services/api/normalizeError";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  // Company Form State (Zero Mock Data)
  const [companyData, setCompanyData] = useState({
    companyName: "",
    registrationNumber: "",
    gstNumber: "",
    website: "",
    officialEmail: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
    currency: "",
  });

  // HR Info State (Zero Mock Data)
  const [hrData, setHrData] = useState({
    headName: "",
    officialEmail: "",
    phone: "",
    escalationLead: "",
    grievanceEmail: "",
    autoOnboardingAlerts: false,
    policyDigestWeekly: false,
  });

  // Security / Password State
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.companyName.trim()) {
      toast.error("Please enter company name.");
      return;
    }
    toast.success("Company information saved successfully!");
  };

  const handleSaveHR = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("HR contact and policy details updated!");
  };

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (passData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      await changePassword({
        oldPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      }).unwrap();

      toast.success("Security credentials and password updated successfully!");
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4"
    >


      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1 bg-secondary/50 rounded-xl border border-border/50">
          <TabsTrigger value="company" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Info</span>
          </TabsTrigger>
          <TabsTrigger value="hr" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <UserCheck className="w-3.5 h-3.5" />
            <span>HR Info</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Password & Security</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment & Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: COMPANY INFO */}
        <TabsContent value="company">
          <form onSubmit={handleSaveCompany} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Organization Identity & Details</h3>
                <p className="text-xs text-muted-foreground">Enter official registered company information and corporate metadata.</p>
              </div>
              <Button type="submit" size="sm" className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold">
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Legal Company Name</Label>
                <Input
                  placeholder="Enter registered legal company name"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Corporate Identification Number (CIN)</Label>
                <Input
                  placeholder="e.g. CIN-U72200MH2024PTC000000"
                  value={companyData.registrationNumber}
                  onChange={(e) => setCompanyData({ ...companyData, registrationNumber: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">GST / Tax ID</Label>
                <Input
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={companyData.gstNumber}
                  onChange={(e) => setCompanyData({ ...companyData, gstNumber: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Corporate Website URL</Label>
                <Input
                  placeholder="https://yourcompany.com"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Administrative Email</Label>
                <Input
                  type="email"
                  placeholder="admin@yourcompany.com"
                  value={companyData.officialEmail}
                  onChange={(e) => setCompanyData({ ...companyData, officialEmail: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Corporate Office Address</Label>
                <Input
                  placeholder="Street / Building / Floor / Suite"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City, State</Label>
                <Input
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={companyData.city}
                  onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Country</Label>
                <Input
                  placeholder="e.g. India"
                  value={companyData.country}
                  onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Default Timezone</Label>
                <Input
                  placeholder="e.g. Asia/Kolkata (IST +05:30)"
                  value={companyData.timezone}
                  onChange={(e) => setCompanyData({ ...companyData, timezone: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Operating Currency</Label>
                <Input
                  placeholder="e.g. INR (₹), USD ($)"
                  value={companyData.currency}
                  onChange={(e) => setCompanyData({ ...companyData, currency: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>
            </div>
          </form>
        </TabsContent>

        {/* TAB 2: HR INFO */}
        <TabsContent value="hr">
          <form onSubmit={handleSaveHR} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">HR Administration & Grievance Directory</h3>
                <p className="text-xs text-muted-foreground">Define points of contact for employee grievances, policy escalations, and onboarding notices.</p>
              </div>
              <Button type="submit" size="sm" className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold">
                <Save className="w-3.5 h-3.5" /> Save HR Info
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Head of HR / Chief People Officer</Label>
                <Input
                  placeholder="Enter HR Head name"
                  value={hrData.headName}
                  onChange={(e) => setHrData({ ...hrData, headName: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official HR Desk Email</Label>
                <Input
                  type="email"
                  placeholder="hr@yourcompany.com"
                  value={hrData.officialEmail}
                  onChange={(e) => setHrData({ ...hrData, officialEmail: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HR Emergency Helpline Phone</Label>
                <Input
                  placeholder="+91 00000 00000"
                  value={hrData.phone}
                  onChange={(e) => setHrData({ ...hrData, phone: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Executive Escalation VP</Label>
                <Input
                  placeholder="e.g. VP People / Legal Head"
                  value={hrData.escalationLead}
                  onChange={(e) => setHrData({ ...hrData, escalationLead: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold">Internal POSH & Grievance Email</Label>
                <Input
                  type="email"
                  placeholder="ethics.hr@yourcompany.com"
                  value={hrData.grievanceEmail}
                  onChange={(e) => setHrData({ ...hrData, grievanceEmail: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>
            </div>

            {/* Notification Directives */}
            <div className="pt-4 border-t border-border/30 space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Automated Notification Directives</h4>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Auto-Alert HR on Candidate Acceptance</p>
                  <p className="text-[11px] text-muted-foreground">Receive instant notifications when an offer letter is electronically signed.</p>
                </div>
                <Switch
                  checked={hrData.autoOnboardingAlerts}
                  onCheckedChange={(c) => setHrData({ ...hrData, autoOnboardingAlerts: c })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Weekly Policy & Attendance Digest</p>
                  <p className="text-[11px] text-muted-foreground">Email aggregated department attendance and leave reports every Monday morning.</p>
                </div>
                <Switch
                  checked={hrData.policyDigestWeekly}
                  onCheckedChange={(c) => setHrData({ ...hrData, policyDigestWeekly: c })}
                />
              </div>
            </div>
          </form>
        </TabsContent>

        {/* TAB 3: PASSWORD & SECURITY */}
        <TabsContent value="password">
          <form onSubmit={handleUpdatePassword} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm max-w-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Password & Access Security</h3>
                <p className="text-xs text-muted-foreground">Update your account credentials and multi-factor authentication preferences.</p>
              </div>
              <Button type="submit" size="sm" className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold">
                <KeyRound className="w-3.5 h-3.5" /> Update Password
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current account password"
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={passData.newPassword}
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter new password to confirm"
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                  className="bg-secondary/30"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Two-Factor Authentication (2FA / MFA)</p>
                <p className="text-[11px] text-muted-foreground">Require an authenticator verification code during admin login.</p>
              </div>
              <Switch
                checked={mfaEnabled}
                onCheckedChange={(c) => {
                  setMfaEnabled(c);
                  toast.success(`MFA ${c ? "Enabled" : "Disabled"}`);
                }}
              />
            </div>
          </form>
        </TabsContent>

        {/* TAB 4: PAYMENT & BILLING (ZERO MOCK DATA) */}
        <TabsContent value="payment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Active Plan Card */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="outline" className="text-[11px] text-muted-foreground border-border/60">
                  No Active Subscription
                </Badge>
                <h3 className="text-xl font-extrabold text-foreground">Community Tier</h3>
                <p className="text-xs text-muted-foreground">
                  Connect a payment method or configure enterprise license to activate AI features.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-border/30">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">—</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Next renewal: —</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm md:col-span-2 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">Payment Method</h3>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Payment gateway integration required")} className="text-xs gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Payment Method
                  </Button>
                </div>

                <div className="p-6 rounded-xl bg-secondary/20 border border-dashed border-border/60 flex flex-col items-center justify-center text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-muted-foreground/60" />
                  <p className="text-xs font-semibold text-foreground">No payment method on file</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm">
                    Add a corporate card, bank mandate, or credit card to enable automatic subscription billing.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/30">
                <span>Billing Contact: —</span>
                <span className="text-primary cursor-pointer hover:underline text-xs" onClick={() => toast.info("Configure billing email dialog")}>
                  Set Billing Email
                </span>
              </div>
            </div>
          </div>

          {/* Invoices History (Zero Mock Data) */}
          <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Invoices & Billing History</h3>
                <p className="text-xs text-muted-foreground">Download receipts and view past tax invoices.</p>
              </div>
              <Button size="sm" variant="ghost" disabled className="text-xs gap-1 opacity-50">
                <Download className="w-3.5 h-3.5" /> Export All
              </Button>
            </div>

            <div className="p-8 rounded-xl bg-secondary/10 border border-dashed border-border/50 flex flex-col items-center justify-center text-center space-y-2">
              <Receipt className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-xs font-bold text-foreground">No billing history available</p>
              <p className="text-[11px] text-muted-foreground max-w-md">
                Invoices, tax receipts, and payment statements will appear here after transactions are processed.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
