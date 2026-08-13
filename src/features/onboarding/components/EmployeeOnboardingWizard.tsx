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

  const handleNext1 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep1(step1Form);
    dispatch(setCurrentWizardStep(2));
  };

  const handleNext2 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep2(step2Form);
    dispatch(setCurrentWizardStep(3));
  };

  const handleNext3 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep3(step3Form);
    dispatch(setCurrentWizardStep(4));
  };

  const handleNext4 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep4(step4Form);
    dispatch(setCurrentWizardStep(5));
  };

  const handleNext5 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep5(step5Form);
    dispatch(setCurrentWizardStep(6));
  };

  const handleNext6 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep6(step6Form);
    dispatch(setCurrentWizardStep(7));
  };

  const handleNext7 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep7(step7Form);
    dispatch(setCurrentWizardStep(8));
  };

  const handleNext9 = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStep9(step9Form);
    await completeOnboarding();
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
              <form onSubmit={handleNext1} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" /> Step 1: Personal & Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={step1Form.first_name}
                      onChange={(e) => setStep1Form({ ...step1Form, first_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={step1Form.middle_name}
                      onChange={(e) => setStep1Form({ ...step1Form, middle_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={step1Form.last_name}
                      onChange={(e) => setStep1Form({ ...step1Form, last_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={step1Form.date_of_birth}
                      onChange={(e) => setStep1Form({ ...step1Form, date_of_birth: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={step1Form.personal_email}
                      onChange={(e) => setStep1Form({ ...step1Form, personal_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={step1Form.phone}
                      onChange={(e) => setStep1Form({ ...step1Form, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-4">
                  <h4 className="text-sm font-medium text-slate-300">Current Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={step1Form.current_address_line1}
                        onChange={(e) => setStep1Form({ ...step1Form, current_address_line1: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={step1Form.current_city}
                        onChange={(e) => setStep1Form({ ...step1Form, current_city: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving1}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Bank Details */}
            {currentWizardStep === 2 && (
              <form onSubmit={handleNext2} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-400" /> Step 2: Direct Deposit & Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={step2Form.bank_name}
                      onChange={(e) => setStep2Form({ ...step2Form, bank_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={step2Form.account_number}
                      onChange={(e) => setStep2Form({ ...step2Form, account_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">IFSC / Routing Code *</label>
                    <input
                      type="text"
                      required
                      value={step2Form.ifsc_code}
                      onChange={(e) => setStep2Form({ ...step2Form, ifsc_code: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={step2Form.branch_name}
                      onChange={(e) => setStep2Form({ ...step2Form, branch_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(1))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving2}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Statutory IDs */}
            {currentWizardStep === 3 && (
              <form onSubmit={handleNext3} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-violet-400" /> Step 3: Government Statutory IDs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">PAN Number</label>
                    <input
                      type="text"
                      value={step3Form.pan_number}
                      onChange={(e) => setStep3Form({ ...step3Form, pan_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      value={step3Form.aadhaar_number}
                      onChange={(e) => setStep3Form({ ...step3Form, aadhaar_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Passport Number</label>
                    <input
                      type="text"
                      value={step3Form.passport_number}
                      onChange={(e) => setStep3Form({ ...step3Form, passport_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">PF Account Number</label>
                    <input
                      type="text"
                      value={step3Form.pf_account_number}
                      onChange={(e) => setStep3Form({ ...step3Form, pf_account_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(2))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving3}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Emergency Contacts */}
            {currentWizardStep === 4 && (
              <form onSubmit={handleNext4} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-violet-400" /> Step 4: Emergency Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Primary Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={step4Form.primary_contact_name}
                      onChange={(e) => setStep4Form({ ...step4Form, primary_contact_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Relationship *</label>
                    <input
                      type="text"
                      required
                      value={step4Form.primary_relationship}
                      onChange={(e) => setStep4Form({ ...step4Form, primary_relationship: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={step4Form.primary_phone}
                      onChange={(e) => setStep4Form({ ...step4Form, primary_phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(3))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving4}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 5: Education */}
            {currentWizardStep === 5 && (
              <form onSubmit={handleNext5} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-violet-400" /> Step 5: Educational History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Highest Qualification</label>
                    <input
                      type="text"
                      value={step5Form.highest_qualification}
                      onChange={(e) => setStep5Form({ ...step5Form, highest_qualification: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Institution / University Name</label>
                    <input
                      type="text"
                      value={step5Form.institution_name}
                      onChange={(e) => setStep5Form({ ...step5Form, institution_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(4))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving5}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 6: Prior Experience */}
            {currentWizardStep === 6 && (
              <form onSubmit={handleNext6} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-400" /> Step 6: Prior Work Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Previous Company</label>
                    <input
                      type="text"
                      value={step6Form.previous_company}
                      onChange={(e) => setStep6Form({ ...step6Form, previous_company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Last Job Title</label>
                    <input
                      type="text"
                      value={step6Form.last_designation}
                      onChange={(e) => setStep6Form({ ...step6Form, last_designation: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(5))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving6}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 7: Additional Info */}
            {currentWizardStep === 7 && (
              <form onSubmit={handleNext7} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" /> Step 7: Additional Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Apparel / Shirt Size</label>
                    <input
                      type="text"
                      value={step7Form.shirt_size}
                      onChange={(e) => setStep7Form({ ...step7Form, shirt_size: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Dietary Preference</label>
                    <input
                      type="text"
                      value={step7Form.dietary_preference}
                      onChange={(e) => setStep7Form({ ...step7Form, dietary_preference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(6))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving7}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
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
              <form onSubmit={handleNext9} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-violet-400" /> Step 9: Compliance & Policy Acceptance
                </h3>
                <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={step9Form.nd_agreement_accepted}
                      onChange={(e) =>
                        setStep9Form({ ...step9Form, nd_agreement_accepted: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
                    />
                    <span className="text-sm text-slate-300">
                      I have read and agree to the Non-Disclosure & Intellectual Property Agreement.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={step9Form.code_of_conduct_accepted}
                      onChange={(e) =>
                        setStep9Form({ ...step9Form, code_of_conduct_accepted: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
                    />
                    <span className="text-sm text-slate-300">
                      I accept the Employee Code of Conduct and Workplace Policies.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(8))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Documents
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving9 || isCompleting}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                  >
                    {isCompleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Complete Onboarding <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
