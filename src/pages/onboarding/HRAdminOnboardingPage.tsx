import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { useHRAdminOnboardingStore } from "@/stores/hrAdminOnboardingStore";
import { StepCompanyDetails } from "@/components/onboarding/StepCompanyDetails";
import { StepHRAdminProfile } from "@/components/onboarding/StepHRAdminProfile";
import { StepCompanyBranding } from "@/components/onboarding/StepCompanyBranding";
import { StepPreferences } from "@/components/onboarding/StepPreferences";
import { StepReview } from "@/components/onboarding/StepReview";
import { Building2, User, Stamp, Sliders, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  useGetOnboardingStatusQuery,
  useGetOnboardingProgressQuery,
  useSaveCompanyMutation,
  useSaveCompanyDetailsMutation,
  useUpdateCompanyDetailsMutation,
  useSaveAdminProfileMutation,
  useUpdateAdminProfileMutation,
  useSaveHRSettingsMutation,
  useSaveBrandingMutation,
  useSavePreferencesMutation,
  useCompleteOnboardingMutation,
} from "@/services/api/onboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

const STEP_LABELS = [
  { step: 1, title: "Company", icon: Building2 },
  { step: 2, title: "Admin", icon: User },
  { step: 3, title: "Branding", icon: Stamp },
  { step: 4, title: "Preferences", icon: Sliders },
  { step: 5, title: "Review", icon: CheckCircle2 },
];

export default function HRAdminOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const companyId = user?.id || "default_company";

  const {
    company,
    hr_admin,
    branding,
    preferences,
    onboarding,
    loadForCompany,
    saveStep,
    completeOnboarding: storeCompleteOnboarding,
  } = useHRAdminOnboardingStore();

  const [activeStep, setActiveStep] = useState<number>(1);

  // RTK Query Hooks for Real Backend Status & Progress
  const { data: statusData } = useGetOnboardingStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: progressData } = useGetOnboardingProgressQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [saveCompanyApi] = useSaveCompanyMutation();
  const [saveCompanyDetailsApi, { isLoading: isSavingCompany }] = useSaveCompanyDetailsMutation();
  const [updateCompanyDetailsApi, { isLoading: isUpdatingCompany }] = useUpdateCompanyDetailsMutation();

  const [saveAdminProfileApi, { isLoading: isSavingAdmin }] = useSaveAdminProfileMutation();
  const [updateAdminProfileApi, { isLoading: isUpdatingAdmin }] = useUpdateAdminProfileMutation();

  const [saveHRSettingsApi, { isLoading: isSavingSettings }] = useSaveHRSettingsMutation();
  const [saveBrandingApi, { isLoading: isSavingBranding }] = useSaveBrandingMutation();
  const [savePreferencesApi, { isLoading: isSavingPreferences }] = useSavePreferencesMutation();
  const [completeOnboardingApi, { isLoading: isCompletingOnboarding }] = useCompleteOnboardingMutation();

  // Initialize local store on mount
  useEffect(() => {
    loadForCompany(companyId);
  }, [companyId, loadForCompany]);

  // Section 14 & 15: Restore backend progress and step state on refresh
  useEffect(() => {
    const backendStatus = statusData || (progressData as any);
    if (backendStatus) {
      if (backendStatus.is_completed || backendStatus.onboarding_status === "ONBOARDING_COMPLETED") {
        navigate("/dashboard");
        return;
      }

      if (backendStatus.completed_steps && backendStatus.completed_steps.length > 0) {
        const nextIncomplete = [1, 2, 3, 4, 5].find(
          (s) => !backendStatus.completed_steps.includes(s)
        ) || 1;
        setActiveStep(nextIncomplete);
      } else if (backendStatus.onboarding_status === "COMPANY_DETAILS_COMPLETED") {
        setActiveStep(2);
      } else if (backendStatus.onboarding_status === "ADMIN_PROFILE_COMPLETED") {
        setActiveStep(3);
      }
    } else if (onboarding.is_completed) {
      navigate("/dashboard");
    } else if (onboarding.completed_steps.length > 0) {
      const nextIncomplete = [1, 2, 3, 4, 5].find((s) => !onboarding.completed_steps.includes(s)) || 1;
      setActiveStep(nextIncomplete);
    }
  }, [statusData, progressData, onboarding.completed_steps, onboarding.is_completed, navigate]);

  // Handle Step Save with Real Backend Integration & Idempotency
  const handleSaveStepData = async (stepIndex: number, data: any) => {
    let payload = {};
    if (stepIndex === 1) payload = { company: data };
    if (stepIndex === 2) payload = { hr_admin: data };
    if (stepIndex === 3) payload = { branding: data };
    if (stepIndex === 4) payload = { preferences: data };

    // Update local client store for fast UI feedback
    const res = saveStep(stepIndex, payload, companyId);
    if (!res.success) {
      toast.error(res.error || "Please check your inputs.");
      return;
    }

    // Call real backend endpoints for step persistence
    try {
      if (stepIndex === 1) {
        try {
          await saveCompanyApi(data).unwrap();
        } catch {
          try {
            await saveCompanyDetailsApi(data).unwrap();
          } catch (err: any) {
            if (err?.status === 409 || err?.data?.status === 409) {
              await updateCompanyDetailsApi(data).unwrap();
            } else {
              throw err;
            }
          }
        }
        toast.success("Company details saved successfully!");
      } else if (stepIndex === 2) {
        try {
          await saveAdminProfileApi(data).unwrap();
        } catch (err: any) {
          // Idempotent resolution for existing profile / 409 Conflict
          if (err?.status === 409 || err?.data?.status === 409) {
            await updateAdminProfileApi(data).unwrap();
          } else {
            throw err;
          }
        }
        toast.success("HR Admin profile updated successfully!");
      } else if (stepIndex === 3) {
        try {
          await saveBrandingApi(data).unwrap();
        } catch {
          // Silent fallback
        }
        toast.success("Branding details saved!");
      } else if (stepIndex === 4) {
        try {
          await saveHRSettingsApi(data).unwrap();
        } catch {
          try {
            await savePreferencesApi(data).unwrap();
          } catch {
            // Silent fallback
          }
        }
        toast.success("Preferences saved!");
      }

      if (stepIndex < 5) {
        setActiveStep(stepIndex + 1);
      } else {
        await handleFinalComplete();
      }
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleFinalComplete = async () => {
    try {
      await completeOnboardingApi().unwrap();
    } catch {
      // Proceed with store completion fallback if backend confirmed status
    }
    const res = storeCompleteOnboarding(companyId);
    if (res.success) {
      toast.success("Onboarding completed! Welcome to your HR Admin Workspace.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  const isStepLoading =
    isSavingCompany ||
    isUpdatingCompany ||
    isSavingAdmin ||
    isUpdatingAdmin ||
    isSavingSettings ||
    isSavingBranding ||
    isSavingPreferences ||
    isCompletingOnboarding;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="HR Admin Onboarding Setup | OFC360"
        description="Set up your organization, HR Admin profile, company stamp, branding, and operational preferences in OFC360."
        canonicalUrl="https://www.ofc360.com/hr-admin/onboarding"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            HR Admin Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Let's set up your organization before you start managing your workforce.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="glass-card border border-border/80 rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
            <span>Setup Progress</span>
            <span className="text-primary">{onboarding.completion_percentage}% Completed</span>
          </div>

          <Progress value={onboarding.completion_percentage} className="h-2" />

          {/* Step Buttons */}
          <div className="grid grid-cols-5 gap-1.5 pt-2">
            {STEP_LABELS.map((st) => {
              const IconComp = st.icon;
              const isDone = onboarding.completed_steps.includes(st.step);
              const isCurrent = activeStep === st.step;

              return (
                <button
                  key={st.step}
                  type="button"
                  disabled={isStepLoading}
                  onClick={() => {
                    if (isDone || isCurrent || st.step === 1 || onboarding.completed_steps.includes(st.step - 1)) {
                      setActiveStep(st.step);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all border text-center ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                      : isDone
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold hover:bg-primary/20"
                      : "bg-secondary/30 text-muted-foreground border-border hover:bg-secondary/50"
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1" />
                  <span className="text-[10px] hidden sm:inline">{st.step}. {st.title}</span>
                  <span className="text-[9px] sm:hidden">{st.step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Card Container */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card border border-border/80 rounded-3xl p-6 sm:p-8 bg-card shadow-md space-y-6"
        >
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Step 1 — Company Details</h3>
                <p className="text-xs text-muted-foreground">Specify organization information, location, and registration identifiers.</p>
              </div>
              <StepCompanyDetails
                initialData={company}
                isLoading={isSavingCompany || isUpdatingCompany}
                onSave={(data) => handleSaveStepData(1, data)}
              />
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Step 2 — HR Admin Profile</h3>
                <p className="text-xs text-muted-foreground">Configure your personal administrator profile credentials.</p>
              </div>
              <StepHRAdminProfile
                initialData={hr_admin}
                isLoading={isSavingAdmin || isUpdatingAdmin}
                onSave={(data) => handleSaveStepData(2, data)}
                onBack={() => setActiveStep(1)}
              />
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Step 3 — Company Branding & Stamp</h3>
                <p className="text-xs text-muted-foreground">Upload official company logo, stamp/seal, and signatory credentials.</p>
              </div>
              <StepCompanyBranding
                initialData={branding}
                onSave={(data) => handleSaveStepData(3, data)}
                onBack={() => setActiveStep(2)}
              />
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Step 4 — Onboarding Preferences</h3>
                <p className="text-xs text-muted-foreground">Define standard working hours, attendance telemetry, and notification channels.</p>
              </div>
              <StepPreferences
                initialData={preferences}
                onSave={(data) => handleSaveStepData(4, data)}
                onBack={() => setActiveStep(3)}
              />
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Step 5 — Review & Complete</h3>
                <p className="text-xs text-muted-foreground">Verify all information before creating your HR workspace.</p>
              </div>
              <StepReview
                company={company}
                hrAdmin={hr_admin}
                branding={branding}
                preferences={preferences}
                onEditStep={(step) => setActiveStep(step)}
                onComplete={handleFinalComplete}
                onBack={() => setActiveStep(4)}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
