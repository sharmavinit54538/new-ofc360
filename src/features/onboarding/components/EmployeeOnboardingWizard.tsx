import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveEmployeeStep1Mutation,
  useSaveEmployeeStep2Mutation,
  useSaveEmployeeStep3Mutation,
  useSaveEmployeeStep4Mutation,
  useSaveEmployeeStep5Mutation,
  useSaveEmployeeStep6Mutation,
  useSaveEmployeeStep7Mutation,
  useSaveEmployeeStep9Mutation,
  useCompleteEmployeeOnboardingMutation,
  useSaveEmployeeDraftMutation,
} from "../employeeOnboardingApi";
import {
  setCurrentWizardStep,
  clearPendingRedirectStep,
} from "../onboardingUiSlice";
import { OnboardingDocumentUpload } from "./OnboardingDocumentUpload";
import {
  Step1PersonalInfo,
  Step2BankDetails,
  Step3StatutoryIDs,
  Step4EmergencyContacts,
  Step5Education,
  Step6Experience,
  Step7Additional,
  Step9Policies,
} from "./wizard-steps";
import {
  User,
  CreditCard,
  FileCheck,
  PhoneCall,
  GraduationCap,
  Briefcase,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Save,
} from "lucide-react";

const STEPS = [
  { step: 1, title: "Personal Info", icon: User },
  { step: 2, title: "Bank Details", icon: CreditCard },
  { step: 3, title: "Statutory IDs", icon: FileCheck },
  { step: 4, title: "Emergency", icon: PhoneCall },
  { step: 5, title: "Education", icon: GraduationCap },
  { step: 6, title: "Experience", icon: Briefcase },
  { step: 7, title: "Additional", icon: Sparkles },
  { step: 8, title: "Documents", icon: UploadCloud },
  { step: 9, title: "Policies & Finish", icon: ShieldCheck },
];

export const EmployeeOnboardingWizard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWizardStep, pendingRedirectStep } = useSelector(
    (state: RootState) => state.onboardingUi
  );

  const { data: statusData } = useGetEmployeeOnboardingStatusQuery();
  const { data: progressData, isLoading: isLoadingProgress } =
    useGetEmployeeOnboardingProgressQuery();

  const [saveStep1, { isLoading: isSaving1 }] = useSaveEmployeeStep1Mutation();
  const [saveStep2, { isLoading: isSaving2 }] = useSaveEmployeeStep2Mutation();
  const [saveStep3, { isLoading: isSaving3 }] = useSaveEmployeeStep3Mutation();
  const [saveStep4, { isLoading: isSaving4 }] = useSaveEmployeeStep4Mutation();
  const [saveStep5, { isLoading: isSaving5 }] = useSaveEmployeeStep5Mutation();
  const [saveStep6, { isLoading: isSaving6 }] = useSaveEmployeeStep6Mutation();
  const [saveStep7, { isLoading: isSaving7 }] = useSaveEmployeeStep7Mutation();
  const [saveStep9, { isLoading: isSaving9 }] = useSaveEmployeeStep9Mutation();
  const [completeOnboarding, { isLoading: isCompleting }] =
    useCompleteEmployeeOnboardingMutation();
  const [saveDraft, { isLoading: isSavingDraft }] = useSaveEmployeeDraftMutation();

  const [redirectToast, setRedirectToast] = useState<string | null>(null);
  const [draftToast, setDraftToast] = useState<string | null>(null);

  // Forms state
  const [step1Form, setStep1Form] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "male",
    marital_status: "single",
    blood_group: "O+",
    nationality: "American",
    father_name: "",
    mother_name: "",
    spouse_name: "",
    personal_email: "",
    phone: "",

    current_address_line1: "",
    current_address_line2: "",
    current_city: "",
    current_state: "",
    current_country: "USA",
    current_pincode: "",

    permanent_address_line1: "",
    permanent_address_line2: "",
    permanent_city: "",
    permanent_state: "",
    permanent_country: "USA",
    permanent_pincode: "",
  });

  const [step2Form, setStep2Form] = useState({
    account_number: "",
    bank_name: "",
    ifsc_code: "",
    branch_name: "",
    account_type: "savings",
  });

  const [step3Form, setStep3Form] = useState({
    pan_number: "",
    aadhaar_number: "",
    passport_number: "",
    pf_account_number: "",
    esi_number: "",
  });

  const [step4Form, setStep4Form] = useState({
    primary_contact_name: "",
    primary_relationship: "",
    primary_phone: "",
    secondary_contact_name: "",
    secondary_relationship: "",
    secondary_phone: "",
  });

  const [step5Form, setStep5Form] = useState({
    highest_qualification: "Bachelor's Degree",
    institution_name: "",
    year_of_passing: "2020",
    field_of_study: "Computer Science",
    grade_or_gpa: "3.8",
  });

  const [step6Form, setStep6Form] = useState({
    previous_company: "",
    last_designation: "",
    employment_duration: "2 years",
    reason_for_leaving: "Career Advancement",
    reference_contact: "",
  });

  const [step7Form, setStep7Form] = useState({
    shirt_size: "M",
    dietary_preference: "Standard",
    bio: "",
    hobbies: "",
  });

  const [step9Form, setStep9Form] = useState({
    nd_agreement_accepted: false,
    code_of_conduct_accepted: false,
    it_policy_accepted: false,
    digital_signature: "",
  });

  // Prefill from progress data
  useEffect(() => {
    if (progressData?.data) {
      const p = progressData.data;
      if (p.step_1_personal) setStep1Form((prev) => ({ ...prev, ...p.step_1_personal }));
      if (p.step_2_bank) setStep2Form((prev) => ({ ...prev, ...p.step_2_bank }));
      if (p.step_3_statutory) setStep3Form((prev) => ({ ...prev, ...p.step_3_statutory }));
      if (p.step_4_emergency) setStep4Form((prev) => ({ ...prev, ...p.step_4_emergency }));
      if (p.step_5_education) setStep5Form((prev) => ({ ...prev, ...p.step_5_education }));
      if (p.step_6_experience) setStep6Form((prev) => ({ ...prev, ...p.step_6_experience }));
      if (p.step_7_additional) setStep7Form((prev) => ({ ...prev, ...p.step_7_additional }));
      if (p.step_9_policies) setStep9Form((prev) => ({ ...prev, ...p.step_9_policies }));
    }
  }, [progressData]);

  // Step redirect guard check
  useEffect(() => {
    if (pendingRedirectStep != null) {
      setRedirectToast(`Step sequence enforced. Redirecting to Step ${pendingRedirectStep}.`);
      dispatch(setCurrentWizardStep(pendingRedirectStep));
      dispatch(clearPendingRedirectStep());
    }
  }, [pendingRedirectStep, dispatch]);

  const handleSaveDraft = async () => {
    try {
      await saveDraft({
        step: currentWizardStep,
        step1Form,
        step2Form,
        step3Form,
        step4Form,
        step5Form,
        step6Form,
        step7Form,
        step9Form,
      }).unwrap();
      setDraftToast("Draft saved successfully.");
      setTimeout(() => setDraftToast(null), 3000);
    } catch {
      setDraftToast("Failed to save draft.");
    }
  };

  const status = statusData?.data;
  const progressPercent = status?.completion_percentage || Math.round((currentWizardStep / 9) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Notifications */}
      {redirectToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-sm shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{redirectToast}</span>
          </div>
          <button
            onClick={() => setRedirectToast(null)}
            className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {draftToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* Header & Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              Employee Self-Service Onboarding
              <span className="text-xs font-normal px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 9-Step Flow
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Complete your profile, bank information, compliance IDs, and document uploads.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" /> Save Draft
            </button>
            <div className="w-44 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentWizardStep === s.step;
            const isDone = currentWizardStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => dispatch(setCurrentWizardStep(s.step))}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-medium text-center ${
                  isActive
                    ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-md shadow-violet-950/40"
                    : isDone
                    ? "bg-slate-800/40 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? "bg-violet-500 text-white"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate w-full text-[10px]">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
        {isLoadingProgress ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading saved employee details...</p>
          </div>
        ) : (
          <>
            {/* Step 1: Personal Info & Address */}
            {currentWizardStep === 1 && (
              <Step1PersonalInfo
                formData={step1Form}
                setFormData={setStep1Form}
                isLoading={isSaving1}
              />
            )}

            {/* Step 2: Bank Details */}
            {currentWizardStep === 2 && (
              <Step2BankDetails
                formData={step2Form}
                setFormData={setStep2Form}
                isLoading={isSaving2}
                onBack={() => dispatch(setCurrentWizardStep(1))}
              />
            )}

            {/* Step 3: Statutory IDs */}
            {currentWizardStep === 3 && (
              <Step3StatutoryIDs
                formData={step3Form}
                setFormData={setStep3Form}
                isLoading={isSaving3}
                onBack={() => dispatch(setCurrentWizardStep(2))}
              />
            )}

            {/* Step 4: Emergency Contacts */}
            {currentWizardStep === 4 && (
              <Step4EmergencyContacts
                formData={step4Form}
                setFormData={setStep4Form}
                isLoading={isSaving4}
                onBack={() => dispatch(setCurrentWizardStep(3))}
              />
            )}

            {/* Step 5: Education */}
            {currentWizardStep === 5 && (
              <Step5Education
                formData={step5Form}
                setFormData={setStep5Form}
                isLoading={isSaving5}
                onBack={() => dispatch(setCurrentWizardStep(4))}
              />
            )}

            {/* Step 6: Prior Experience */}
            {currentWizardStep === 6 && (
              <Step6Experience
                formData={step6Form}
                setFormData={setStep6Form}
                isLoading={isSaving6}
                onBack={() => dispatch(setCurrentWizardStep(5))}
              />
            )}

            {/* Step 7: Additional Info */}
            {currentWizardStep === 7 && (
              <Step7Additional
                formData={step7Form}
                setFormData={setStep7Form}
                isLoading={isSaving7}
                onBack={() => dispatch(setCurrentWizardStep(6))}
              />
            )}

            {/* Step 8: Document Upload Sub-component */}
            {currentWizardStep === 8 && (
              <OnboardingDocumentUpload
                documents={progressData?.data?.step_8_documents}
                onCompleteStep={() => dispatch(setCurrentWizardStep(9))}
              />
            )}

            {/* Step 9: Policies & Completion */}
            {currentWizardStep === 9 && (
              <Step9Policies
                formData={step9Form}
                setFormData={setStep9Form}
                isLoading={isSaving9}
                isCompleting={isCompleting}
                onBack={() => dispatch(setCurrentWizardStep(8))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};