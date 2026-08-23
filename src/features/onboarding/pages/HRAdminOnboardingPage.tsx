import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/app/hooks";
import { updateUser } from "@/features/auth/authSlice";
import {
  useGetHRAdminOnboardingStatusQuery,
  useGetHRAdminOnboardingWizardDataQuery,
  useSaveHRAdminOnboardingStepMutation,
  useCompleteHRAdminOnboardingMutation,
} from "@/services/api/hrAdminOnboardingApi";
import { useHRAdminOnboardingStore } from "@/stores/hrAdminOnboardingStore";
import { normalizeError } from "@/services/api/normalizeError";
import { Building2, User, Stamp, Sliders, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/seo/SEOHead";
import { toast } from "sonner";
import { StepCompanyDetails } from "@/features/onboarding/components/StepCompanyDetails";
import { StepHRAdminProfile } from "@/features/onboarding/components/StepHRAdminProfile";
import { StepCompanyBranding } from "@/features/onboarding/components/StepCompanyBranding";
import { StepPreferences } from "@/features/onboarding/components/StepPreferences";
import { StepReview } from "@/features/onboarding/components/StepReview";
import type {
  CompleteOnboardingData,
  CompanyDetails,
  HRAdminProfile,
  CompanyBranding,
  OnboardingPreferences,
} from "@/types/hrAdminOnboarding";

/* ─── Step Config (5 Steps aligned with snake_case contract) ────────── */

const STEPS = [
  { step: 1, title: "Company Details", icon: Building2, description: "Organization details & statutory identifiers" },
  { step: 2, title: "HR Admin Profile", icon: User, description: "Admin profile & contact information" },
  { step: 3, title: "Branding & Stamp", icon: Stamp, description: "Official company seal, logo & signatory" },
  { step: 4, title: "Preferences", icon: Sliders, description: "Work days, hours & attendance setup" },
  { step: 5, title: "Review & Complete", icon: CheckCircle2, description: "Verify all details and finalize" },
];

const initialCompleteData: CompleteOnboardingData = {
  company: {
    company_name: "",
    industry: "",
    country: "India",
    city: "",
    company_size: "",
    timezone: "Asia/Kolkata",
    address: "",
    cin_number: "",
    gst_number: "",
    pan_number: "",
    tan_number: "",
    msme_registration_number: "",
    website: "",
    official_email: "",
    official_phone: "",
  },
  hr_admin: {
    first_name: "",
    last_name: "",
    profile_photo: "",
    mobile_number: "",
    designation: "HR Administrator",
    preferred_language: "English",
  },
  branding: {
    company_logo: "",
    company_stamp: "",
    authorized_signatory_name: "",
    authorized_signatory_designation: "",
    letterhead: "",
  },
  preferences: {
    work_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    work_hours: "09:00 - 18:00",
    attendance_telemetry: "Face + Web Check-in",
    payroll_cycle_start: 1,
    notification_channels: ["Email", "In-App"],
  },
  onboarding: {
    current_step: 1,
    completed_steps: [],
    remaining_steps: [1, 2, 3, 4, 5],
    completion_percentage: 0,
    is_completed: false,
  },
};

/* ─── Component ────────────────────────────────────────────────────── */

export default function HRAdminOnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, companyId } = useAuth();

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

  // Local form state holding full snake_case CompleteOnboardingData
  const [activeStep, setActiveStep] = useState<number>(1);
  const [formData, setFormData] = useState<CompleteOnboardingData>(initialCompleteData);

  // Sync from backend when wizard data loads or changes
  useEffect(() => {
    if (wizardData) {
      setFormData((prev) => ({
        company: {
          ...prev.company,
          ...(wizardData.company || {}),
        },
        hr_admin: {
          ...prev.hr_admin,
          ...(wizardData.hr_admin || {}),
        },
        branding: {
          ...prev.branding,
          ...(wizardData.branding || {}),
        },
        preferences: {
          ...prev.preferences,
          ...(wizardData.preferences || {}),
          work_days: wizardData.preferences?.work_days?.length
            ? wizardData.preferences.work_days
            : prev.preferences.work_days,
          notification_channels: wizardData.preferences?.notification_channels?.length
            ? wizardData.preferences.notification_channels
            : prev.preferences.notification_channels,
        },
        onboarding: {
          ...prev.onboarding,
          ...(wizardData.onboarding || {}),
        },
      }));
      useHRAdminOnboardingStore.getState().syncFromBackend(wizardData);
    }
  }, [wizardData]);

  // Set active step from backend status or redirect if completed
  useEffect(() => {
    if (statusData?.completed) {
      navigate("/dashboard", { replace: true });
    } else if (statusData && typeof statusData.current_step === "number") {
      const targetStep = statusData.current_step === 0 ? 1 : statusData.current_step;
      setActiveStep((current) => {
        // Auto-navigate to current incomplete step on initial load
        return current === 1 && targetStep > 1 ? targetStep : current;
      });
    }
  }, [statusData, navigate]);

  const isMutating = isSaving || isCompleting;
  const isLoading = isStatusLoading || isWizardLoading;
  const isError = isStatusError || isWizardError;

  // Step Save Handlers
  const handleSaveCompany = async (companyData: CompanyDetails) => {
    try {
      await saveStep({
        stepIndex: 1,
        payload: { company: companyData },
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        company: companyData,
        onboarding: {
          ...prev.onboarding,
          current_step: 2,
          completed_steps: Array.from(new Set([...prev.onboarding.completed_steps, 1])),
        },
      }));
      useHRAdminOnboardingStore.getState().saveStep(1, { company: companyData }, companyId || undefined);
      toast.success("Company details saved successfully!");
      setActiveStep(2);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save company details.");
    }
  };

  const handleSaveHRAdmin = async (hrAdminData: HRAdminProfile) => {
    try {
      await saveStep({
        stepIndex: 2,
        payload: { hr_admin: hrAdminData },
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        hr_admin: hrAdminData,
        onboarding: {
          ...prev.onboarding,
          current_step: 3,
          completed_steps: Array.from(new Set([...prev.onboarding.completed_steps, 2])),
        },
      }));
      useHRAdminOnboardingStore.getState().saveStep(2, { hr_admin: hrAdminData }, companyId || undefined);
      toast.success("HR Admin profile saved successfully!");
      setActiveStep(3);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save HR Admin profile.");
    }
  };

  const handleSaveBranding = async (brandingData: CompanyBranding) => {
    try {
      await saveStep({
        stepIndex: 3,
        payload: { branding: brandingData },
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        branding: brandingData,
        onboarding: {
          ...prev.onboarding,
          current_step: 4,
          completed_steps: Array.from(new Set([...prev.onboarding.completed_steps, 3])),
        },
      }));
      useHRAdminOnboardingStore.getState().saveStep(3, { branding: brandingData }, companyId || undefined);
      toast.success("Company branding saved successfully!");
      setActiveStep(4);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save branding details.");
    }
  };

  const handleSavePreferences = async (prefData: OnboardingPreferences) => {
    try {
      await saveStep({
        stepIndex: 4,
        payload: { preferences: prefData },
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        preferences: prefData,
        onboarding: {
          ...prev.onboarding,
          current_step: 5,
          completed_steps: Array.from(new Set([...prev.onboarding.completed_steps, 4])),
        },
      }));
      useHRAdminOnboardingStore.getState().saveStep(4, { preferences: prefData }, companyId || undefined);
      toast.success("Preferences saved successfully!");
      setActiveStep(5);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save preferences.");
    }
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding().unwrap();
      useHRAdminOnboardingStore.getState().completeOnboarding(companyId || undefined);
      dispatch(updateUser({ onboarding_completed: true }));
      await refetchStatus().unwrap();
      toast.success("🎉 Onboarding completed! Welcome to your HR workspace.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to complete onboarding.");
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((activeStep - 1) / 5) * 100)
  );

  // ─── Loading State ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title="HR Admin Onboarding Setup | OFC360"
          description="Set up your organization in OFC360."
          canonicalUrl="https://www.ofc360.com/hr-admin/onboarding"
        />
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Failed to Load Onboarding</h2>
            <p className="text-sm text-muted-foreground">
              Could not fetch onboarding data. Please check your connection and try again.
            </p>
          </div>
          <Button
            onClick={() => {
              refetchStatus();
              refetchWizard();
            }}
            className="w-full gap-2 gradient-bg text-primary-foreground font-semibold"
          >
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
        description="Set up your organization details, admin profile, company stamp, and operational preferences in OFC360."
        canonicalUrl="https://www.ofc360.com/hr-admin/onboarding"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            HR Admin Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Complete all 5 steps to configure your organization and activate your HR workspace.
          </p>
        </div>

        {/* ─── Stepper ─────────────────────────────────────────── */}
        <div className="glass-card border border-border/80 rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
            <span>Setup Progress (Step {activeStep} of 5)</span>
            <span className="text-primary font-bold">{progressPercent}% Complete</span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          <div className="grid grid-cols-5 gap-1.5 pt-2">
            {STEPS.map((st) => {
              const IconComp = st.icon;
              const isCurrent = activeStep === st.step;
              const isDone = formData.onboarding.completed_steps.includes(st.step) || activeStep > st.step;
              const canNavigate = isDone || isCurrent || st.step <= activeStep;

              return (
                <button
                  key={st.step}
                  type="button"
                  disabled={isMutating || !canNavigate}
                  onClick={() => canNavigate && setActiveStep(st.step)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all border text-center ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                      : isDone
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold hover:bg-primary/20"
                      : "bg-secondary/30 text-muted-foreground border-border cursor-not-allowed opacity-50"
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1" />
                  <span className="text-[10px] hidden md:inline truncate">{st.step}. {st.title}</span>
                  <span className="text-[9px] md:hidden">{st.step}</span>
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
            transition={{ duration: 0.25 }}
            className="glass-card border border-border/80 rounded-3xl p-6 sm:p-8 bg-card shadow-md space-y-6"
          >
            {/* Step 1: Company Details */}
            {activeStep === 1 && (
              <StepCompanyDetails
                initialData={formData.company}
                onSave={handleSaveCompany}
                isLoading={isSaving}
              />
            )}

            {/* Step 2: HR Admin Profile */}
            {activeStep === 2 && (
              <StepHRAdminProfile
                initialData={formData.hr_admin}
                onSave={handleSaveHRAdmin}
                onBack={() => setActiveStep(1)}
                isLoading={isSaving}
              />
            )}

            {/* Step 3: Company Branding & Official Stamp */}
            {activeStep === 3 && (
              <StepCompanyBranding
                initialData={formData.branding}
                onSave={handleSaveBranding}
                onBack={() => setActiveStep(2)}
                isLoading={isSaving}
              />
            )}

            {/* Step 4: Onboarding Preferences */}
            {activeStep === 4 && (
              <StepPreferences
                initialData={formData.preferences}
                onSave={handleSavePreferences}
                onBack={() => setActiveStep(3)}
                isLoading={isSaving}
              />
            )}

            {/* Step 5: Review & Complete */}
            {activeStep === 5 && (
              <StepReview
                company={formData.company}
                hrAdmin={formData.hr_admin}
                branding={formData.branding}
                preferences={formData.preferences}
                onEditStep={(stepIndex) => setActiveStep(stepIndex)}
                onComplete={handleComplete}
                onBack={() => setActiveStep(4)}
                isLoading={isCompleting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}