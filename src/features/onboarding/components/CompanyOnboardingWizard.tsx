import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetCompanyOnboardingStatusQuery,
  useGetCompanyOnboardingProgressQuery,
  useSaveCompanyStep1Mutation,
  useSaveAdminProfileStep2Mutation,
  useSaveHRSettingsStep3Mutation,
  useSaveDepartmentsStep4Mutation,
  useSaveDesignationsStep5Mutation,
  useInviteEmployeesStep6Mutation,
  useCompleteCompanyOnboardingStep7Mutation,
} from "../companyOnboardingApi";
import {
  setCurrentWizardStep,
  clearPendingRedirectStep,
} from "../onboardingUiSlice";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  Step1CompanyProfile,
  Step2AdminProfile,
  Step3HRSettings,
  Step4Departments,
  Step5Designations,
  Step6InviteEmployees,
  Step7CompleteSetup,
  CompanyOnboardingStepper,
} from "@/features/onboarding/components/company-wizard-steps";

export const CompanyOnboardingWizard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWizardStep, pendingRedirectStep } = useSelector(
    (state: RootState) => state.onboardingUi
  );

  const { data: statusData } = useGetCompanyOnboardingStatusQuery();
  const { data: progressData, isLoading: isLoadingProgress } =
    useGetCompanyOnboardingProgressQuery();

  const [saveStep1, { isLoading: isSaving1 }] = useSaveCompanyStep1Mutation();
  const [saveStep2, { isLoading: isSaving2 }] = useSaveAdminProfileStep2Mutation();
  const [saveStep3, { isLoading: isSaving3 }] = useSaveHRSettingsStep3Mutation();
  const [saveStep4, { isLoading: isSaving4 }] = useSaveDepartmentsStep4Mutation();
  const [saveStep5, { isLoading: isSaving5 }] = useSaveDesignationsStep5Mutation();
  const [saveStep6, { isLoading: isSaving6 }] = useInviteEmployeesStep6Mutation();
  const [completeStep7, { isLoading: isSaving7 }] =
    useCompleteCompanyOnboardingStep7Mutation();

  const [redirectToast, setRedirectToast] = useState<string | null>(null);

  // Form states prefilled from progress
  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
  });

  const [adminForm, setAdminForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    designation: "Company Administrator",
  });

  const [hrSettingsForm, setHrSettingsForm] = useState({
    leave_year_start: "January 1",
    require_document_verification: true,
    auto_invite_employees: true,
  });

  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Human Resources",
    "Sales & Marketing",
    "Finance",
  ]);
  const [newDept, setNewDept] = useState("");

  const [designations, setDesignations] = useState<string[]>([
    "Software Engineer",
    "HR Manager",
    "Account Executive",
    "Financial Analyst",
  ]);
  const [newDesig, setNewDesig] = useState("");

  const [invites, setInvites] = useState<
    Array<{ email: string; name: string; role: string; department: string }>
  >([
    {
      email: "colleague@example.com",
      name: "Jane Doe",
      role: "Employee",
      department: "Engineering",
    },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  // Sync prefill from /progress API
  useEffect(() => {
    if (progressData?.data) {
      const p = progressData.data;
      if (p.company_profile) {
        setCompanyForm((prev) => ({ ...prev, ...p.company_profile }));
      }
      if (p.admin_profile) {
        setAdminForm((prev) => ({ ...prev, ...p.admin_profile }));
      }
      if (p.hr_settings) {
        setHrSettingsForm((prev) => ({ ...prev, ...p.hr_settings }));
      }
      if (Array.isArray(p.departments) && p.departments.length > 0) {
        setDepartments(
          p.departments.map((d: any) => (typeof d === "string" ? d : d.name))
        );
      }
      if (Array.isArray(p.designations) && p.designations.length > 0) {
        setDesignations(
          p.designations.map((d: any) => (typeof d === "string" ? d : d.title || d.name))
        );
      }
    }
  }, [progressData]);

  // Handle server step redirect guard (redirect_step)
  useEffect(() => {
    if (pendingRedirectStep != null) {
      setRedirectToast(`Step sequence required. Navigating to Step ${pendingRedirectStep}.`);
      dispatch(setCurrentWizardStep(pendingRedirectStep));
      dispatch(clearPendingRedirectStep());
    }
  }, [pendingRedirectStep, dispatch]);

  const handleNextStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep1(companyForm);
    dispatch(setCurrentWizardStep(2));
  };

  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep2(adminForm);
    dispatch(setCurrentWizardStep(3));
  };

  const handleNextStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep3(hrSettingsForm);
    dispatch(setCurrentWizardStep(4));
  };

  const handleNextStep4 = async () => {
    await saveStep4({ departments });
    dispatch(setCurrentWizardStep(5));
  };

  const handleNextStep5 = async () => {
    await saveStep5({ designations });
    dispatch(setCurrentWizardStep(6));
  };

  const handleNextStep6 = async () => {
    await saveStep6({ invites });
    dispatch(setCurrentWizardStep(7));
  };

  const handleComplete = async () => {
    await completeStep7();
  };

  const status = statusData?.data;
  const progressPercent = status?.completion_percentage || Math.round((currentWizardStep / 7) * 100);

  const renderStep = () => {
    switch (currentWizardStep) {
      case 1:
        return (
          <Step1CompanyProfile
            formData={companyForm}
            setFormData={setCompanyForm}
            isLoading={isSaving1}
            onSubmit={handleNextStep1}
          />
        );
      case 2:
        return (
          <Step2AdminProfile
            formData={adminForm}
            setFormData={setAdminForm}
            isLoading={isSaving2}
            onSubmit={handleNextStep2}
            onBack={() => dispatch(setCurrentWizardStep(1))}
          />
        );
      case 3:
        return (
          <Step3HRSettings
            formData={hrSettingsForm}
            setFormData={setHrSettingsForm}
            isLoading={isSaving3}
            onSubmit={handleNextStep3}
            onBack={() => dispatch(setCurrentWizardStep(2))}
          />
        );
      case 4:
        return (
          <Step4Departments
            departments={departments}
            setDepartments={setDepartments}
            newDept={newDept}
            setNewDept={setNewDept}
            isLoading={isSaving4}
            onSubmit={handleNextStep4}
            onBack={() => dispatch(setCurrentWizardStep(3))}
          />
        );
      case 5:
        return (
          <Step5Designations
            designations={designations}
            setDesignations={setDesignations}
            newDesig={newDesig}
            setNewDesig={setNewDesig}
            isLoading={isSaving5}
            onSubmit={handleNextStep5}
            onBack={() => dispatch(setCurrentWizardStep(4))}
          />
        );
      case 6:
        return (
          <Step6InviteEmployees
            invites={invites}
            setInvites={setInvites}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteName={inviteName}
            setInviteName={setInviteName}
            departments={departments}
            isLoading={isSaving6}
            onSubmit={handleNextStep6}
            onBack={() => dispatch(setCurrentWizardStep(5))}
          />
        );
      case 7:
        return (
          <Step7CompleteSetup
            isLoading={isSaving7}
            onSubmit={handleComplete}
            onBack={() => dispatch(setCurrentWizardStep(6))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Warning */}
      {redirectToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-sm shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{redirectToast}</span>
          </div>
          <button
            onClick={() => setRedirectToast(null)}
            className="text-xs px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              Company Onboarding Setup
              <span className="text-xs font-normal px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Tenant Setup
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Configure organizational structure, admin profiles, and department settings.
            </p>
          </div>
          <div className="w-full md:w-48 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Overall Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <CompanyOnboardingStepper
          currentWizardStep={currentWizardStep}
          onStepClick={(step) => dispatch(setCurrentWizardStep(step))}
          progressPercent={progressPercent}
        />
      </div>

      {/* Step Contents */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
        {isLoadingProgress ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading onboarding progress...</p>
          </div>
        ) : (
          <>{renderStep()}</>
        )}
      </div>
    </div>
  );
};