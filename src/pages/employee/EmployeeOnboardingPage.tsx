import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveStep1PersonalMutation,
  useSaveStep2IdentityMutation,
  useSaveStep3EmergencyContactsMutation,
  useSaveStep4EducationMutation,
  useSaveStep5ExperienceMutation,
  useSaveStep6BankMutation,
  useSaveStep7TaxMutation,
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useCompleteStep8DocumentsMutation,
  useSaveStep9PoliciesMutation,
  useCompleteEmployeeOnboardingMutation,
} from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Step1PersonalInfo,
  Step2Identity,
  Step3EmergencyContacts,
  Step4Education,
  Step5Experience,
  Step6Banking,
  Step7TaxPF,
  Step8Documents,
  Step9Policies,
  OnboardingStepper,
} from "@/features/onboarding/components/employee-wizard-steps";
import { UploadedDoc } from "@/features/onboarding/components/employee-wizard-steps/Step8Documents";

export default function EmployeeOnboardingPage() {
  const navigate = useNavigate();

  // Active step (1 - 9)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Queries & Mutations
  const { data: statusData, refetch: refetchStatus } = useGetEmployeeOnboardingStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: progressData } = useGetEmployeeOnboardingProgressQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [saveStep1, { isLoading: isSavingStep1 }] = useSaveStep1PersonalMutation();
  const [saveStep2, { isLoading: isSavingStep2 }] = useSaveStep2IdentityMutation();
  const [saveStep3, { isLoading: isSavingStep3 }] = useSaveStep3EmergencyContactsMutation();
  const [saveStep4, { isLoading: isSavingStep4 }] = useSaveStep4EducationMutation();
  const [saveStep5, { isLoading: isSavingStep5 }] = useSaveStep5ExperienceMutation();
  const [saveStep6, { isLoading: isSavingStep6 }] = useSaveStep6BankMutation();
  const [saveStep7, { isLoading: isSavingStep7 }] = useSaveStep7TaxMutation();
  const [uploadDocument, { isLoading: isUploadingDoc }] = useUploadStep8DocumentMutation();
  const [deleteDocument, { isLoading: isDeletingDoc }] = useDeleteStep8DocumentMutation();
  const [completeStep8, { isLoading: isCompletingStep8 }] = useCompleteStep8DocumentsMutation();
  const [saveStep9, { isLoading: isSavingStep9 }] = useSaveStep9PoliciesMutation();
  const [completeOnboarding, { isLoading: isCompletingOnboarding }] = useCompleteEmployeeOnboardingMutation();

  // Form States (Zero Mock Data Defaults)
  const [step1Data, setStep1Data] = useState({ full_name: "", dob: "", gender: "Male", personal_email: "", mobile: "", address: "" });
  const [step2Data, setStep2Data] = useState({ aadhaar_number: "", pan_number: "", passport_number: "" });
  const [step3Data, setStep3Data] = useState({ emergency_name: "", relationship: "Parent", emergency_phone: "", alternate_phone: "" });
  const [step4Data, setStep4Data] = useState({ degree: "", institution: "", field_of_study: "", passing_year: "" });
  const [step5Data, setStep5Data] = useState({ company_name: "", designation: "", start_date: "", end_date: "", responsibilities: "" });
  const [step6Data, setStep6Data] = useState({ account_holder_name: "", bank_name: "", account_number: "", ifsc_code: "" });
  const [step7Data, setStep7Data] = useState({ tax_regime: "New Regime", uan_number: "", pf_account_number: "", nominee_name: "" });
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [step9Data, setStep9Data] = useState({ nda_acknowledged: false, code_of_conduct_acknowledged: false, signature_name: "" });

  // Restore step and progress on mount / refetch
  useEffect(() => {
    if (statusData) {
      if (statusData.is_completed) {
        toast.info("Your employee onboarding has been completed!");
        navigate("/employee");
        return;
      }
      if (statusData.completed_steps && statusData.completed_steps.length > 0) {
        const nextStep = [1, 2, 3, 4, 5, 6, 7, 8, 9].find(
          (s) => !statusData.completed_steps.includes(s)
        ) || 1;
        setActiveStep(nextStep);
      }
    }

    if (progressData) {
      if (progressData.step_1_personal) setStep1Data((prev) => ({ ...prev, ...progressData.step_1_personal }));
      if (progressData.step_2_identity) setStep2Data((prev) => ({ ...prev, ...progressData.step_2_identity }));
      if (progressData.step_3_emergency_contacts) setStep3Data((prev) => ({ ...prev, ...progressData.step_3_emergency_contacts }));
      if (progressData.step_4_education) setStep4Data((prev) => ({ ...prev, ...progressData.step_4_education }));
      if (progressData.step_5_experience) setStep5Data((prev) => ({ ...prev, ...progressData.step_5_experience }));
      if (progressData.step_6_bank) setStep6Data((prev) => ({ ...prev, ...progressData.step_6_bank }));
      if (progressData.step_7_tax) setStep7Data((prev) => ({ ...prev, ...progressData.step_7_tax }));
      if (progressData.step_8_documents) setUploadedDocs(progressData.step_8_documents);
      if (progressData.step_9_policies) setStep9Data((prev) => ({ ...prev, ...progressData.step_9_policies }));
    }
  }, [statusData, progressData, navigate]);

  // Step 1: Personal Info
  const handleSaveStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Data.full_name || !step1Data.mobile) {
      toast.error("Please fill in mandatory personal fields.");
      return;
    }
    try {
      await saveStep1(step1Data).unwrap();
      toast.success("Step 1 (Personal Info) saved successfully!");
      setActiveStep(2);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 2: Identity (Aadhaar, PAN)
  const handleSaveStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Data.aadhaar_number || !step2Data.pan_number) {
      toast.error("Aadhaar and PAN details are required.");
      return;
    }
    try {
      await saveStep2(step2Data).unwrap();
      toast.success("Step 2 (Identity Information) verified!");
      setActiveStep(3);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 3: Emergency Contacts & Dependents (Per Section 49)
  const handleSaveStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step3Data.emergency_name || !step3Data.emergency_phone) {
      toast.error("Primary Emergency Contact Name and Phone are required.");
      return;
    }
    try {
      await saveStep3(step3Data).unwrap();
      toast.success("Step 3 (Emergency Contacts) saved!");
      setActiveStep(4);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 4: Education
  const handleSaveStep4 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step4Data.degree || !step4Data.institution) {
      toast.error("Degree and Institution fields are required.");
      return;
    }
    try {
      await saveStep4(step4Data).unwrap();
      toast.success("Step 4 (Education Records) saved!");
      setActiveStep(5);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 5: Work Experience
  const handleSaveStep5 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep5(step5Data).unwrap();
      toast.success("Step 5 (Experience Details) saved!");
      setActiveStep(6);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 6: Bank & Financial
  const handleSaveStep6 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step6Data.account_number || !step6Data.ifsc_code) {
      toast.error("Account Number and IFSC Code are required for payroll.");
      return;
    }
    try {
      await saveStep6(step6Data).unwrap();
      toast.success("Step 6 (Payroll Banking) saved!");
      setActiveStep(7);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 7: Tax & PF
  const handleSaveStep7 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep7(step7Data).unwrap();
      toast.success("Step 7 (Tax Regime & PF) saved!");
      setActiveStep(8);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 8: Document Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docType);

    try {
      const res = await uploadDocument(formData).unwrap();
      setUploadedDocs((prev) => [...prev, res]);
      toast.success(`${docType} document uploaded successfully!`);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await deleteDocument(docId).unwrap();
      setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document deleted.");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const handleSaveStep8 = async () => {
    if (uploadedDocs.length === 0) {
      toast.error("Please upload at least one mandatory document.");
      return;
    }
    try {
      await completeStep8().unwrap();
      toast.success("Step 8 (Document Uploads) completed!");
      setActiveStep(9);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  // Step 9: Policies & NDA Sign-off
  const handleSaveStep9 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step9Data.nda_acknowledged || !step9Data.code_of_conduct_acknowledged) {
      toast.error("Please acknowledge all corporate policy agreements.");
      return;
    }
    if (!step9Data.signature_name.trim()) {
      toast.error("Please type your full legal signature.");
      return;
    }

    try {
      await saveStep9(step9Data).unwrap();
      await completeOnboarding().unwrap();
      toast.success("Employee Onboarding Completed Successfully!");
      setTimeout(() => navigate("/employee"), 1200);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const completedSteps = statusData?.completed_steps || [];
  const completionPercentage = Math.round((completedSteps.length / 9) * 100);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <Step1PersonalInfo
            formData={step1Data}
            setFormData={setStep1Data}
            isLoading={isSavingStep1}
            onSubmit={handleSaveStep1}
          />
        );
      case 2:
        return (
          <Step2Identity
            formData={step2Data}
            setFormData={setStep2Data}
            isLoading={isSavingStep2}
            onSubmit={handleSaveStep2}
            onBack={() => setActiveStep(1)}
          />
        );
      case 3:
        return (
          <Step3EmergencyContacts
            formData={step3Data}
            setFormData={setStep3Data}
            isLoading={isSavingStep3}
            onSubmit={handleSaveStep3}
            onBack={() => setActiveStep(2)}
          />
        );
      case 4:
        return (
          <Step4Education
            formData={step4Data}
            setFormData={setStep4Data}
            isLoading={isSavingStep4}
            onSubmit={handleSaveStep4}
            onBack={() => setActiveStep(3)}
          />
        );
      case 5:
        return (
          <Step5Experience
            formData={step5Data}
            setFormData={setStep5Data}
            isLoading={isSavingStep5}
            onSubmit={handleSaveStep5}
            onBack={() => setActiveStep(4)}
          />
        );
      case 6:
        return (
          <Step6Banking
            formData={step6Data}
            setFormData={setStep6Data}
            isLoading={isSavingStep6}
            onSubmit={handleSaveStep6}
            onBack={() => setActiveStep(5)}
          />
        );
      case 7:
        return (
          <Step7TaxPF
            formData={step7Data}
            setFormData={setStep7Data}
            isLoading={isSavingStep7}
            onSubmit={handleSaveStep7}
            onBack={() => setActiveStep(6)}
          />
        );
      case 8:
        return (
          <Step8Documents
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
            isUploadingDoc={isUploadingDoc}
            isCompletingStep8={isCompletingStep8}
            onFileUpload={handleFileUpload}
            onDeleteDocument={handleDeleteDocument}
            onSubmit={handleSaveStep8}
            onBack={() => setActiveStep(7)}
          />
        );
      case 9:
        return (
          <Step9Policies
            formData={step9Data}
            setFormData={setStep9Data}
            isSavingStep9={isSavingStep9}
            isCompletingOnboarding={isCompletingOnboarding}
            onSubmit={handleSaveStep9}
            onBack={() => setActiveStep(8)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead title="Employee Self-Service Onboarding | OFC360" description="Complete your employee onboarding milestones." />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Employee Onboarding</h1>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Complete your 9-step mandatory onboarding requirements for compliance, payroll, and IT access.
          </p>
        </div>

        {/* Stepper Header */}
        <OnboardingStepper
          activeStep={activeStep}
          completedSteps={completedSteps}
          onStepClick={setActiveStep}
          completionPercentage={completionPercentage}
        />

        {/* Step Container */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card border border-border/80 rounded-3xl p-6 sm:p-8 bg-card shadow-md space-y-6"
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}