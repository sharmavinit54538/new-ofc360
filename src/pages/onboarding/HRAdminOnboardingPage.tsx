import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetHRAdminOnboardingStatusQuery,
  useGetHRAdminOnboardingWizardDataQuery,
  useSaveHRAdminOnboardingStepMutation,
  useCompleteHRAdminOnboardingMutation,
} from "@/services/api/hrAdminOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { Building2, User, Shield, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/seo/SEOHead";
import { toast } from "sonner";
import type { OnboardingWizardData, SaveStepPayload } from "@/types/hrAdminOnboardingApi.types";

/* ─── Step Config ──────────────────────────────────────────────────── */

const STEPS = [
  { index: 0, title: "Company Info", icon: Building2, description: "Organization details and location" },
  { index: 1, title: "Admin Profile", icon: User, description: "Your name, phone, and avatar" },
  { index: 2, title: "Branding & Consent", icon: Shield, description: "Logo, terms, and data processing" },
  { index: 3, title: "Review & Complete", icon: CheckCircle2, description: "Verify everything and finish" },
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Manufacturing",
  "Retail", "Consulting", "Media", "Real Estate", "Hospitality", "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];

const TIMEZONES = [
  "Asia/Kolkata", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo",
  "Asia/Shanghai", "Australia/Sydney", "Pacific/Auckland",
];

/* ─── Component ────────────────────────────────────────────────────── */

export default function HRAdminOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // RTK Query
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useGetHRAdminOnboardingStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: wizardData,
    isLoading: isWizardLoading,
    isError: isWizardError,
    refetch: refetchWizard,
  } = useGetHRAdminOnboardingWizardDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [saveStep, { isLoading: isSaving }] = useSaveHRAdminOnboardingStepMutation();
  const [completeOnboarding, { isLoading: isCompleting }] = useCompleteHRAdminOnboardingMutation();

  // Local form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingWizardData>>({
    companyName: "", logo: "", industry: "", companySize: "",
    website: "", country: "India", timezone: "Asia/Kolkata",
    address: "", city: "", state: "", zipCode: "", gstNumber: "",
    fullName: "", phone: "", avatar: "",
    termsAccepted: true, dpaAccepted: true,
  });

  // Sync from backend when wizard data loads
  useEffect(() => {
    if (wizardData) {
      setFormData((prev) => ({ ...prev, ...wizardData }));
    }
  }, [wizardData]);

  // Redirect if already completed
  useEffect(() => {
    if (statusData?.completed) {
      toast.success("Onboarding already completed!");
      navigate("/dashboard");
    }
  }, [statusData, navigate]);

  // Set active step from backend status
  useEffect(() => {
    if (statusData && !statusData.completed) {
      setActiveStep(statusData.current_step);
    }
  }, [statusData]);

  // Redirect if already completed
  useEffect(() => {
    if (statusData?.completed) {
      navigate("/dashboard", { replace: true });
    }
  }, [statusData, navigate]);

  const isMutating = isSaving || isCompleting;
  const isLoading = isStatusLoading || isWizardLoading;
  const isError = isStatusError || isWizardError;

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const progressPercent = statusData
    ? Math.round(((statusData.current_step) / statusData.total_steps) * 100)
    : 0;

  // ─── Step Save Handler ──────────────────────────────────────────
  const handleSaveStep = async (stepIndex: number) => {
    let payload: SaveStepPayload = {};

    if (stepIndex === 0) {
      if (!formData.companyName?.trim()) { toast.error("Company name is required."); return; }
      if (!formData.industry?.trim()) { toast.error("Industry is required."); return; }
      payload = {
        companyName: formData.companyName, logo: formData.logo,
        industry: formData.industry, companySize: formData.companySize,
        website: formData.website, country: formData.country,
        timezone: formData.timezone, address: formData.address,
        city: formData.city, state: formData.state,
        zipCode: formData.zipCode, gstNumber: formData.gstNumber,
      };
    } else if (stepIndex === 1) {
      if (!formData.fullName?.trim()) { toast.error("Full name is required."); return; }
      if (!formData.phone?.trim()) { toast.error("Phone number is required."); return; }
      payload = {
        fullName: formData.fullName, phone: formData.phone, avatar: formData.avatar,
      };
    } else if (stepIndex === 2) {
      payload = {
        logo: formData.logo,
        termsAccepted: formData.termsAccepted,
        dpaAccepted: formData.dpaAccepted,
      };
    }

    try {
      const result = await saveStep({ stepIndex, payload }).unwrap();
      setFormData((prev) => ({ ...prev, ...result }));
      toast.success(`Step ${stepIndex + 1} saved successfully!`);
      if (stepIndex < 3) {
        setActiveStep(stepIndex + 1);
      }
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  // ─── Complete Handler ───────────────────────────────────────────
  const handleComplete = async () => {
    try {
      await completeOnboarding().unwrap();
      const updated = await refetchStatus().unwrap();
      if (updated?.completed) {
        toast.success("🎉 Onboarding completed! Welcome to your HR workspace.");
      } else {
        toast.success("Setup complete! Entering workspace...");
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  // ─── Loading State ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <SEOHead title="HR Admin Onboarding Setup | OFC360" description="Set up your organization in OFC360." canonicalUrl="https://www.ofc360.com/hr-admin/onboarding" />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Skeleton className="h-10 w-72 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Failed to Load Onboarding</h2>
            <p className="text-sm text-muted-foreground">Could not fetch onboarding data. Please check your connection and try again.</p>
          </div>
          <Button onClick={() => { refetchStatus(); refetchWizard(); }} className="w-full gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="HR Admin Onboarding Setup | OFC360"
        description="Set up your organization, admin profile, and consent in OFC360."
        canonicalUrl="https://www.ofc360.com/hr-admin/onboarding"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            HR Admin Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Complete {STEPS.length} steps to set up your HR workspace.
          </p>
        </div>

        {/* ─── Stepper ─────────────────────────────────────────── */}
        <div className="glass-card border border-border/80 rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
            <span>Setup Progress</span>
            <span className="text-primary">{progressPercent}% Complete</span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          <div className="grid grid-cols-4 gap-1.5 pt-2">
            {STEPS.map((st) => {
              const IconComp = st.icon;
              const isCurrent = activeStep === st.index;
              const isDone = statusData ? st.index < statusData.current_step : false;
              const canNavigate = isDone || isCurrent;

              return (
                <button
                  key={st.index}
                  type="button"
                  disabled={isMutating || !canNavigate}
                  onClick={() => canNavigate && setActiveStep(st.index)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all border text-center ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                      : isDone
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold hover:bg-primary/20"
                      : "bg-secondary/30 text-muted-foreground border-border cursor-not-allowed opacity-50"
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1" />
                  <span className="text-[10px] hidden sm:inline">{st.index + 1}. {st.title}</span>
                  <span className="text-[9px] sm:hidden">{st.index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Step Content ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass-card border border-border/80 rounded-3xl p-6 sm:p-8 bg-card shadow-md space-y-6"
          >
            {/* Step 0: Company Info */}
            {activeStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Step 1 — Company Information</h3>
                  <p className="text-xs text-muted-foreground">Enter your organization details, location, and identifiers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" value={formData.companyName || ""} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry || ""} onValueChange={(v) => updateField("industry", v)}>
                      <SelectTrigger id="industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select value={formData.companySize || ""} onValueChange={(v) => updateField("companySize", v)}>
                      <SelectTrigger id="companySize"><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent>{COMPANY_SIZES.map((s) => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={formData.website || ""} onChange={(e) => updateField("website", e.target.value)} placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={formData.country || "India"} onChange={(e) => updateField("country", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone || "Asia/Kolkata"} onValueChange={(v) => updateField("timezone", v)}>
                      <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                      <SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={formData.address || ""} onChange={(e) => updateField("address", e.target.value)} placeholder="Street address" rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={formData.state || ""} onChange={(e) => updateField("state", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" value={formData.zipCode || ""} onChange={(e) => updateField("zipCode", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input id="gstNumber" value={formData.gstNumber || ""} onChange={(e) => updateField("gstNumber", e.target.value)} placeholder="22AAAAA0000A1Z5" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSaveStep(0)} disabled={isMutating} className="gap-2 gradient-bg text-primary-foreground">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: Admin Profile */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Step 2 — Admin Profile</h3>
                  <p className="text-xs text-muted-foreground">Provide your personal details for the HR Admin account.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={formData.fullName || ""} onChange={(e) => updateField("fullName", e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input id="avatar" value={formData.avatar || ""} onChange={(e) => updateField("avatar", e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(0)} disabled={isMutating}>Back</Button>
                  <Button onClick={() => handleSaveStep(1)} disabled={isMutating} className="gap-2 gradient-bg text-primary-foreground">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Branding & Consent */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Step 3 — Branding & Consent</h3>
                  <p className="text-xs text-muted-foreground">Upload your company logo and accept the required agreements.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo URL</Label>
                    <Input id="logo" value={formData.logo || ""} onChange={(e) => updateField("logo", e.target.value)} placeholder="https://..." />
                    {formData.logo && (
                      <div className="mt-2 p-3 border border-border/50 rounded-xl bg-muted/30 inline-block">
                        <img src={formData.logo} alt="Company logo preview" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-start gap-3">
                      <Checkbox id="termsAccepted" checked={formData.termsAccepted ?? true} onCheckedChange={(checked) => updateField("termsAccepted", !!checked)} />
                      <label htmlFor="termsAccepted" className="text-sm leading-relaxed cursor-pointer">
                        I accept the <span className="text-primary font-medium">Terms of Service</span> and agree to abide by the platform usage policies.
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="dpaAccepted" checked={formData.dpaAccepted ?? true} onCheckedChange={(checked) => updateField("dpaAccepted", !!checked)} />
                      <label htmlFor="dpaAccepted" className="text-sm leading-relaxed cursor-pointer">
                        I accept the <span className="text-primary font-medium">Data Processing Agreement</span> for handling employee data.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(1)} disabled={isMutating}>Back</Button>
                  <Button onClick={() => handleSaveStep(2)} disabled={isMutating} className="gap-2 gradient-bg text-primary-foreground">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Complete */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Step 4 — Review & Complete</h3>
                  <p className="text-xs text-muted-foreground">Verify all information before finalizing your setup.</p>
                </div>

                <div className="space-y-4">
                  {/* Company Summary */}
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Company Info</h4>
                      <Button variant="ghost" size="sm" onClick={() => setActiveStep(0)} className="text-xs text-primary h-7">Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Name:</span><span className="font-medium">{formData.companyName || "—"}</span>
                      <span className="text-muted-foreground">Industry:</span><span className="font-medium">{formData.industry || "—"}</span>
                      <span className="text-muted-foreground">Size:</span><span className="font-medium">{formData.companySize || "—"}</span>
                      <span className="text-muted-foreground">Country:</span><span className="font-medium">{formData.country || "—"}</span>
                      <span className="text-muted-foreground">City:</span><span className="font-medium">{formData.city || "—"}</span>
                      <span className="text-muted-foreground">Website:</span><span className="font-medium truncate">{formData.website || "—"}</span>
                    </div>
                  </div>

                  {/* Admin Summary */}
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Admin Profile</h4>
                      <Button variant="ghost" size="sm" onClick={() => setActiveStep(1)} className="text-xs text-primary h-7">Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Full Name:</span><span className="font-medium">{formData.fullName || "—"}</span>
                      <span className="text-muted-foreground">Phone:</span><span className="font-medium">{formData.phone || "—"}</span>
                    </div>
                  </div>

                  {/* Consent Summary */}
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Consent</h4>
                      <Button variant="ghost" size="sm" onClick={() => setActiveStep(2)} className="text-xs text-primary h-7">Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Terms Accepted:</span><span className="font-medium">{formData.termsAccepted ? "✓ Yes" : "✗ No"}</span>
                      <span className="text-muted-foreground">DPA Accepted:</span><span className="font-medium">{formData.dpaAccepted ? "✓ Yes" : "✗ No"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(2)} disabled={isMutating}>Back</Button>
                  <Button onClick={handleComplete} disabled={isMutating} className="gap-2 gradient-bg text-primary-foreground px-8">
                    {isCompleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
