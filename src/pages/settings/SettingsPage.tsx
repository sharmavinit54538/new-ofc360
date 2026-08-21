import { useState, useEffect } from "react";
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
  AlertCircle,
  Loader2,
  QrCode,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/api/endpoints/auth";
import {
  useGetHRSettingsQuery,
  useUpdateHRSettingsMutation,
  useGetMFASettingsQuery,
  useEnableMFAMutation,
  useDisableMFAMutation,
  useVerifyMFAMutation,
} from "@/services/api/settingsApi";
import {
  useGetBillingSubscriptionQuery,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetBillingInvoicesQuery,
} from "@/services/api/billingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { PaymentMethod, EnableMFAResponse } from "@/types/api/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  // =========================================================================
  // TAB 1: Company Form State
  // =========================================================================
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

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.companyName.trim()) {
      toast.error("Please enter company name.");
      return;
    }
    toast.success("Company information saved successfully!");
  };

  // =========================================================================
  // TAB 2: HR Settings (Real API Integration: GET & PUT /api/v1/settings/hr)
  // =========================================================================
  const {
    data: hrSettings,
    isLoading: isLoadingHR,
    isFetching: isFetchingHR,
    error: hrError,
    refetch: refetchHR,
  } = useGetHRSettingsQuery();

  const [updateHRSettings, { isLoading: isSavingHR }] = useUpdateHRSettingsMutation();

  const [hrData, setHrData] = useState({
    headName: "",
    officialEmail: "",
    phone: "",
    escalationLead: "",
    grievanceEmail: "",
    autoOnboardingAlerts: false,
    policyDigestWeekly: false,
  });

  // Populate form with server data when loaded
  useEffect(() => {
    if (hrSettings) {
      setHrData({
        headName: hrSettings.headName || "",
        officialEmail: hrSettings.officialEmail || "",
        phone: hrSettings.phone || "",
        escalationLead: hrSettings.escalationLead || "",
        grievanceEmail: hrSettings.grievanceEmail || "",
        autoOnboardingAlerts: Boolean(hrSettings.autoOnboardingAlerts),
        policyDigestWeekly: Boolean(hrSettings.policyDigestWeekly),
      });
    }
  }, [hrSettings]);

  const handleSaveHR = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHRSettings(hrData).unwrap();
      toast.success("HR contact and policy details updated successfully!");
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save HR settings.");
    }
  };

  // =========================================================================
  // TAB 3: Password & Security / MFA (POST /api/v1/settings/mfa/enable & disable)
  // =========================================================================
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const { data: mfaSettings, isLoading: isLoadingMFA } = useGetMFASettingsQuery();
  const [enableMFA, { isLoading: isEnablingMFA }] = useEnableMFAMutation();
  const [disableMFA, { isLoading: isDisablingMFA }] = useDisableMFAMutation();
  const [verifyMFA, { isLoading: isVerifyingMFA }] = useVerifyMFAMutation();

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isMfaSetupOpen, setIsMfaSetupOpen] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState<EnableMFAResponse | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isMfaDisableOpen, setIsMfaDisableOpen] = useState(false);

  useEffect(() => {
    if (mfaSettings) {
      setMfaEnabled(Boolean(mfaSettings.enabled));
    }
  }, [mfaSettings]);

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

  const handleToggleMFA = async (enableRequested: boolean) => {
    if (enableRequested) {
      try {
        const res = await enableMFA().unwrap();
        if (res.requiresVerification || res.qrCodeUri || res.secret || res.provisioningUri) {
          setMfaSetupData(res);
          setOtpCode("");
          setIsMfaSetupOpen(true);
        } else if (res.enabled) {
          setMfaEnabled(true);
          toast.success("Two-Factor Authentication enabled successfully!");
        }
      } catch (err: any) {
        const norm = normalizeError(err);
        toast.error(norm.message || "Failed to initiate Two-Factor Authentication setup.");
      }
    } else {
      setIsMfaDisableOpen(true);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit verification code.");
      return;
    }
    try {
      await verifyMFA({ code: otpCode.trim(), secret: mfaSetupData?.secret }).unwrap();
      setMfaEnabled(true);
      setIsMfaSetupOpen(false);
      setMfaSetupData(null);
      toast.success("Two-Factor Authentication activated and verified successfully!");
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Verification failed. Please check the OTP code.");
    }
  };

  const handleConfirmDisableMFA = async () => {
    try {
      await disableMFA().unwrap();
      setMfaEnabled(false);
      setIsMfaDisableOpen(false);
      toast.success("Two-Factor Authentication has been disabled.");
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to disable MFA.");
    }
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    toast.success("MFA Secret key copied to clipboard.");
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  // =========================================================================
  // TAB 4: Billing Subscription, Payment Methods & Invoices
  // =========================================================================
  const {
    data: subscription,
    isLoading: isLoadingSub,
    error: subError,
    refetch: refetchSub,
  } = useGetBillingSubscriptionQuery();

  const {
    data: paymentMethods = [],
    isLoading: isLoadingPM,
    refetch: refetchPM,
  } = useGetPaymentMethodsQuery();

  const [addPaymentMethod, { isLoading: isAddingPM }] = useAddPaymentMethodMutation();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();

  const [isAddPmOpen, setIsAddPmOpen] = useState(false);
  const [pmForm, setPmForm] = useState({
    cardholderName: "",
    brand: "Visa",
    last4: "",
    expMonth: 12,
    expYear: 2028,
    isDefault: true,
  });

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLast4 = pmForm.last4.replace(/\D/g, "").slice(-4);
    if (cleanLast4.length !== 4) {
      toast.error("Please enter the last 4 digits of your card.");
      return;
    }
    if (!pmForm.cardholderName.trim()) {
      toast.error("Please enter cardholder name.");
      return;
    }

    try {
      await addPaymentMethod({
        brand: pmForm.brand,
        last4: cleanLast4,
        expMonth: Number(pmForm.expMonth),
        expYear: Number(pmForm.expYear),
        cardholderName: pmForm.cardholderName.trim(),
        isDefault: pmForm.isDefault,
      }).unwrap();

      toast.success("Payment method added securely!");
      setIsAddPmOpen(false);
      setPmForm({
        cardholderName: "",
        brand: "Visa",
        last4: "",
        expMonth: 12,
        expYear: 2028,
        isDefault: true,
      });
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to add payment method.");
    }
  };

  const handleDeletePM = async (id: string) => {
    try {
      await deletePaymentMethod(id).unwrap();
      toast.success("Payment method removed.");
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to delete payment method.");
    }
  };

  const handleSetDefaultPM = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id).unwrap();
      toast.success("Primary payment method updated.");
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to set default payment method.");
    }
  };

  // Invoices
  const [invoicePage, setInvoicePage] = useState(1);
  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useGetBillingInvoicesQuery({ page: invoicePage, limit: 10 });

  const invoices = invoicesData?.invoices || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1 bg-secondary/50 rounded-xl border border-border/50">
          <TabsTrigger
            value="company"
            className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="hr"
            className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>HR Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password & Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
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

        {/* TAB 2: HR INFO (REAL GET & PUT /api/v1/settings/hr) */}
        <TabsContent value="hr">
          <form onSubmit={handleSaveHR} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">HR Administration & Grievance Directory</h3>
                <p className="text-xs text-muted-foreground">Define points of contact for employee grievances, policy escalations, and onboarding notices.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetchHR()}
                  disabled={isFetchingHR}
                  className="text-xs h-8 gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingHR ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingHR || isLoadingHR}
                  className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold h-8"
                >
                  {isSavingHR ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save HR Info
                </Button>
              </div>
            </div>

            {isLoadingHR ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground font-medium">Loading HR Settings from server...</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </form>
        </TabsContent>

        {/* TAB 3: PASSWORD & SECURITY / MFA */}
        <TabsContent value="password">
          <form onSubmit={handleUpdatePassword} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm max-w-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Password & Access Security</h3>
                <p className="text-xs text-muted-foreground">Update your account credentials and multi-factor authentication preferences.</p>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={isChangingPassword}
                className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold"
              >
                {isChangingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                Update Password
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
                  placeholder="Enter new password (min. 8 characters)"
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

            {/* MFA Real Security Switch */}
            <div className="pt-4 border-t border-border/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">Two-Factor Authentication (2FA / MFA)</p>
                  <Badge variant={mfaEnabled ? "default" : "outline"} className={`text-[10px] ${mfaEnabled ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : ""}`}>
                    {mfaEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Require a time-based one-time verification code (TOTP) from Google Authenticator or Authy during admin login.
                </p>
              </div>

              <Switch
                checked={mfaEnabled}
                disabled={isEnablingMFA || isDisablingMFA || isLoadingMFA}
                onCheckedChange={handleToggleMFA}
              />
            </div>
          </form>
        </TabsContent>

        {/* TAB 4: PAYMENT & BILLING (REAL APIS) */}
        <TabsContent value="payment" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Active Plan Card (GET /api/v1/billing/subscription) */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={subscription?.status === "active" ? "default" : "outline"}
                    className={`text-[11px] ${
                      subscription?.status === "active"
                        ? "bg-primary/15 text-primary border-primary/20"
                        : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {subscription?.status === "active" ? "Active Subscription" : subscription?.status || "Community Tier"}
                  </Badge>
                  {isLoadingSub && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                </div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {subscription?.plan || "Community Tier"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enterprise AI workforce suite with full attendance, payroll, connect, and recruitment features.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/30">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">
                    {subscription?.price && subscription.price > 0
                      ? `₹${subscription.price.toLocaleString("en-IN")}`
                      : "Free"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {subscription?.billingCycle?.toLowerCase() || "month"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Seats: {subscription?.usedSeats || 0} / {subscription?.seats || "∞"} used</span>
                  <span>Renewal: {subscription?.renewalDate || subscription?.nextBillingDate || "—"}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods Card (GET & POST /api/v1/billing/payment-methods) */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm md:col-span-2 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Payment Methods</h3>
                    <p className="text-xs text-muted-foreground">Manage authorized cards and corporate billing instruments.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddPmOpen(true)}
                    className="text-xs gap-1 h-8 bg-secondary/40 border-border/60 hover:bg-secondary"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Payment Method
                  </Button>
                </div>

                {isLoadingPM ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="p-6 rounded-xl bg-secondary/20 border border-dashed border-border/60 flex flex-col items-center justify-center text-center space-y-2">
                    <CreditCard className="w-8 h-8 text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-foreground">No payment method on file</p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      Add a corporate card, bank mandate, or credit card to enable automatic subscription billing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {paymentMethods.map((pm: PaymentMethod) => (
                      <div
                        key={pm.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-border transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-6 rounded bg-card border border-border/60 flex items-center justify-center font-bold text-[10px] text-foreground tracking-wider uppercase">
                            {pm.brand || "Card"}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              •••• •••• •••• {pm.last4}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Expires {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
                              {pm.cardholderName ? ` • ${pm.cardholderName}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {pm.isDefault ? (
                            <Badge className="text-[10px] bg-primary/15 text-primary border-primary/20">
                              Default
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefaultPM(pm.id)}
                              className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                            >
                              Make Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePM(pm.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Remove payment method"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/30">
                <span>Billing Status: Active</span>
                <span className="text-primary cursor-pointer hover:underline text-xs" onClick={() => refetchPM()}>
                  Refresh Payment Methods
                </span>
              </div>
            </div>
          </div>

          {/* Invoices & Billing History (GET /api/v1/billing/invoices) */}
          <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Invoices & Billing History</h3>
                <p className="text-xs text-muted-foreground">Download receipts and view past tax invoices.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetchInvoices()}
                disabled={isLoadingInvoices}
                className="text-xs gap-1.5 h-8"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInvoices ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {isLoadingInvoices ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-8 rounded-xl bg-secondary/10 border border-dashed border-border/50 flex flex-col items-center justify-center text-center space-y-2">
                <Receipt className="w-8 h-8 text-muted-foreground/50" />
                <p className="text-xs font-bold text-foreground">No billing history available</p>
                <p className="text-[11px] text-muted-foreground max-w-md">
                  Invoices, tax receipts, and payment statements will appear here after transactions are processed.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-xl border border-border/40">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow>
                        <TableHead className="text-xs font-semibold">Invoice #</TableHead>
                        <TableHead className="text-xs font-semibold">Date</TableHead>
                        <TableHead className="text-xs font-semibold">Amount</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                        <TableHead className="text-right text-xs font-semibold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id} className="text-xs">
                          <TableCell className="font-semibold text-foreground">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {inv.date || inv.issueDate || "—"}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {inv.currency === "INR" || !inv.currency ? `₹${inv.amount.toLocaleString("en-IN")}` : `$${inv.amount.toLocaleString()}`}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] capitalize ${
                                inv.status === "paid"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : inv.status === "pending"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {inv.downloadUrl || inv.pdfUrl ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                asChild
                                className="h-7 px-2 text-xs text-primary gap-1 cursor-pointer"
                              >
                                <a href={inv.downloadUrl || inv.pdfUrl} target="_blank" rel="noreferrer">
                                  <Download className="w-3 h-3" /> Download
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" disabled className="h-7 px-2 text-xs opacity-50 gap-1">
                                <Download className="w-3 h-3" /> Receipt
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {invoicesData?.totalPages && invoicesData.totalPages > 1 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <span>Page {invoicesData.page || invoicePage} of {invoicesData.totalPages}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={invoicePage <= 1}
                        onClick={() => setInvoicePage((p) => Math.max(1, p - 1))}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <ChevronLeft className="w-3 h-3" /> Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={invoicePage >= (invoicesData.totalPages || 1)}
                        onClick={() => setInvoicePage((p) => p + 1)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        Next <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* DIALOG: MFA Setup Modal (QR Code & Secret)                                 */}
      {/* ========================================================================= */}
      <Dialog open={isMfaSetupOpen} onOpenChange={setIsMfaSetupOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Set Up Two-Factor Authentication</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Scan this QR code with Google Authenticator, Authy, or Microsoft Authenticator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl border border-border/50">
              {mfaSetupData?.qrCodeUri || mfaSetupData?.qrCode ? (
                <img
                  src={mfaSetupData.qrCodeUri || mfaSetupData.qrCode}
                  alt="MFA QR Code"
                  className="w-44 h-44 rounded-lg bg-white p-2 border border-border/40 shadow-xs object-contain"
                />
              ) : (
                <div className="w-44 h-44 rounded-lg bg-white p-4 border border-border/40 flex flex-col items-center justify-center text-center space-y-1 text-slate-800">
                  <QrCode className="w-12 h-12 text-primary" />
                  <p className="text-[11px] font-bold text-foreground">Scan via Authenticator</p>
                  <p className="text-[9px] text-muted-foreground">Use the secret key below</p>
                </div>
              )}
            </div>

            {/* Secret Key for Manual Entry */}
            {mfaSetupData?.secret && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Manual Setup Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={mfaSetupData.secret}
                    className="bg-secondary/40 font-mono text-xs tracking-wider"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopySecret(mfaSetupData.secret!)}
                    className="shrink-0 h-10 px-3 text-xs gap-1"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSecret ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            )}

            {/* OTP Verification Form */}
            <form onSubmit={handleVerifyMFA} className="space-y-3 pt-2 border-t border-border/30">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  6-Digit Verification Code
                </Label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="bg-secondary/30 text-center font-mono text-lg tracking-widest h-11"
                  autoFocus
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsMfaSetupOpen(false);
                    setMfaSetupData(null);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isVerifyingMFA || otpCode.length < 6}
                  className="gradient-bg text-primary-foreground font-semibold text-xs gap-1.5"
                >
                  {isVerifyingMFA ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  Verify & Activate
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: MFA Disable Confirmation Modal                                    */}
      {/* ========================================================================= */}
      <Dialog open={isMfaDisableOpen} onOpenChange={setIsMfaDisableOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Disable Two-Factor Authentication?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Disabling 2FA will remove the extra layer of security on your administrator account. Anyone with your password will be able to log in.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMfaDisableOpen(false)}
              className="text-xs"
            >
              Keep 2FA Enabled
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDisablingMFA}
              onClick={handleConfirmDisableMFA}
              className="text-xs gap-1.5"
            >
              {isDisablingMFA ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              Yes, Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Add Payment Method Modal                                          */}
      {/* ========================================================================= */}
      <Dialog open={isAddPmOpen} onOpenChange={setIsAddPmOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Add Corporate Payment Method</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Authorize a corporate credit or debit card for subscription billing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPaymentMethod} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cardholder Name</Label>
              <Input
                placeholder="Name on card"
                value={pmForm.cardholderName}
                onChange={(e) => setPmForm({ ...pmForm, cardholderName: e.target.value })}
                className="bg-secondary/30"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Card Brand / Network</Label>
                <select
                  value={pmForm.brand}
                  onChange={(e) => setPmForm({ ...pmForm, brand: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="RuPay">RuPay</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Last 4 Digits</Label>
                <Input
                  maxLength={4}
                  placeholder="4242"
                  value={pmForm.last4}
                  onChange={(e) => setPmForm({ ...pmForm, last4: e.target.value.replace(/\D/g, "") })}
                  className="bg-secondary/30 font-mono text-center tracking-wider"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Expiry Month</Label>
                <select
                  value={pmForm.expMonth}
                  onChange={(e) => setPmForm({ ...pmForm, expMonth: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")} - {new Date(2000, m - 1).toLocaleString("default", { month: "short" })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Expiry Year</Label>
                <select
                  value={pmForm.expYear}
                  onChange={(e) => setPmForm({ ...pmForm, expYear: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Set as Primary Payment Method</p>
                <p className="text-[11px] text-muted-foreground">Automatically charge this card for upcoming renewal cycles.</p>
              </div>
              <Switch
                checked={pmForm.isDefault}
                onCheckedChange={(c) => setPmForm({ ...pmForm, isDefault: c })}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddPmOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isAddingPM}
                className="gradient-bg text-primary-foreground font-semibold text-xs gap-1.5"
              >
                {isAddingPM ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Payment Method
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}