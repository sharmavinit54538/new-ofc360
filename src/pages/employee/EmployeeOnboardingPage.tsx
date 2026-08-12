import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  PhoneCall,
  GraduationCap,
  Briefcase,
  Building,
  Receipt,
  FileText,
  CheckCircle2,
  Upload,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Identity", icon: ShieldCheck },
  { id: 3, label: "Contacts", icon: PhoneCall },
  { id: 4, label: "Education", icon: GraduationCap },
  { id: 5, label: "Experience", icon: Briefcase },
  { id: 6, label: "Banking", icon: Building },
  { id: 7, label: "Tax & PF", icon: Receipt },
  { id: 8, label: "Documents", icon: Upload },
  { id: 9, label: "NDA & Policies", icon: FileCheck },
];

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
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ id: string; name: string; type: string; status: string }>>([]);
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
        <div className="glass-card border border-border/80 rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pb-2 border-b border-border/50">
            <span>Onboarding Completion</span>
            <span className="text-primary">{completionPercentage}% Completed</span>
          </div>

          <Progress value={completionPercentage} className="h-2" />

          {/* Stepper Buttons */}
          <div className="grid grid-cols-9 gap-1 pt-2 overflow-x-auto">
            {STEPS.map((s) => {
              const IconComp = s.icon;
              const isDone = completedSteps.includes(s.id);
              const isCurrent = activeStep === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStep(s.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center border ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                      : isDone
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-semibold"
                      : "bg-secondary/30 text-muted-foreground border-border"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[9px] hidden md:inline">{s.id}. {s.label}</span>
                  <span className="text-[8px] md:hidden">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Container */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card border border-border/80 rounded-3xl p-6 sm:p-8 bg-card shadow-md space-y-6"
        >
          {/* STEP 1: PERSONAL INFORMATION */}
          {activeStep === 1 && (
            <form onSubmit={handleSaveStep1} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 1 — Personal Information</h3>
                <p className="text-xs text-muted-foreground">Provide basic personal and residential details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Full Legal Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={step1Data.full_name}
                    onChange={(e) => setStep1Data({ ...step1Data, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Date of Birth</Label>
                  <Input
                    type="date"
                    value={step1Data.dob}
                    onChange={(e) => setStep1Data({ ...step1Data, dob: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Gender</Label>
                  <Select value={step1Data.gender} onValueChange={(val) => setStep1Data({ ...step1Data, gender: val })}>
                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Mobile Number *</Label>
                  <Input
                    placeholder="+91 00000 00000"
                    value={step1Data.mobile}
                    onChange={(e) => setStep1Data({ ...step1Data, mobile: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Personal Email</Label>
                  <Input
                    type="email"
                    placeholder="personal@email.com"
                    value={step1Data.personal_email}
                    onChange={(e) => setStep1Data({ ...step1Data, personal_email: e.target.value })}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Residential Address</Label>
                  <Textarea
                    placeholder="Full postal address"
                    value={step1Data.address}
                    onChange={(e) => setStep1Data({ ...step1Data, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSavingStep1} className="gradient-bg gap-2 text-xs">
                  {isSavingStep1 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: IDENTITY INFO */}
          {activeStep === 2 && (
            <form onSubmit={handleSaveStep2} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 2 — Identity Proofs</h3>
                <p className="text-xs text-muted-foreground">Government identity numbers for tax and compliance verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Aadhaar Card Number *</Label>
                  <Input
                    placeholder="12-digit Aadhaar number"
                    value={step2Data.aadhaar_number}
                    onChange={(e) => setStep2Data({ ...step2Data, aadhaar_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">PAN Card Number *</Label>
                  <Input
                    placeholder="10-digit PAN (e.g. ABCDE1234F)"
                    value={step2Data.pan_number}
                    onChange={(e) => setStep2Data({ ...step2Data, pan_number: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Passport Number (Optional)</Label>
                  <Input
                    placeholder="Passport number"
                    value={step2Data.passport_number}
                    onChange={(e) => setStep2Data({ ...step2Data, passport_number: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(1)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep2} className="gradient-bg gap-2 text-xs">
                  {isSavingStep2 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: EMERGENCY CONTACTS (SECTION 49) */}
          {activeStep === 3 && (
            <form onSubmit={handleSaveStep3} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 3 — Emergency Contacts & Dependents</h3>
                <p className="text-xs text-muted-foreground">Emergency contacts for workplace safety and family insurance coverage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Primary Contact Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={step3Data.emergency_name}
                    onChange={(e) => setStep3Data({ ...step3Data, emergency_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Relationship</Label>
                  <Select value={step3Data.relationship} onValueChange={(val) => setStep3Data({ ...step3Data, relationship: val })}>
                    <SelectTrigger><SelectValue placeholder="Relationship" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Emergency Mobile Number *</Label>
                  <Input
                    placeholder="+91 00000 00000"
                    value={step3Data.emergency_phone}
                    onChange={(e) => setStep3Data({ ...step3Data, emergency_phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Alternate Phone (Optional)</Label>
                  <Input
                    placeholder="+91 00000 00000"
                    value={step3Data.alternate_phone}
                    onChange={(e) => setStep3Data({ ...step3Data, alternate_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(2)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep3} className="gradient-bg gap-2 text-xs">
                  {isSavingStep3 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: EDUCATION */}
          {activeStep === 4 && (
            <form onSubmit={handleSaveStep4} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 4 — Education Records</h3>
                <p className="text-xs text-muted-foreground">Highest qualification and academic institution details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Degree / Qualification *</Label>
                  <Input
                    placeholder="e.g. B.Tech Computer Science / MBA"
                    value={step4Data.degree}
                    onChange={(e) => setStep4Data({ ...step4Data, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">University / College *</Label>
                  <Input
                    placeholder="University name"
                    value={step4Data.institution}
                    onChange={(e) => setStep4Data({ ...step4Data, institution: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Field of Study</Label>
                  <Input
                    placeholder="e.g. Engineering / Business"
                    value={step4Data.field_of_study}
                    onChange={(e) => setStep4Data({ ...step4Data, field_of_study: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Year of Passing</Label>
                  <Input
                    placeholder="e.g. 2024"
                    value={step4Data.passing_year}
                    onChange={(e) => setStep4Data({ ...step4Data, passing_year: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(3)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep4} className="gradient-bg gap-2 text-xs">
                  {isSavingStep4 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 5: PRIOR EXPERIENCE */}
          {activeStep === 5 && (
            <form onSubmit={handleSaveStep5} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 5 — Work Experience</h3>
                <p className="text-xs text-muted-foreground">Previous employer and work history.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Previous Company</Label>
                  <Input
                    placeholder="Company name"
                    value={step5Data.company_name}
                    onChange={(e) => setStep5Data({ ...step5Data, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Designation / Role</Label>
                  <Input
                    placeholder="Role title"
                    value={step5Data.designation}
                    onChange={(e) => setStep5Data({ ...step5Data, designation: e.target.value })}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Key Responsibilities</Label>
                  <Textarea
                    placeholder="Brief description of work handled"
                    value={step5Data.responsibilities}
                    onChange={(e) => setStep5Data({ ...step5Data, responsibilities: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(4)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep5} className="gradient-bg gap-2 text-xs">
                  {isSavingStep5 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 6: BANK & FINANCIAL INFO */}
          {activeStep === 6 && (
            <form onSubmit={handleSaveStep6} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 6 — Payroll Banking</h3>
                <p className="text-xs text-muted-foreground">Direct salary deposit bank details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Account Holder Name</Label>
                  <Input
                    placeholder="Name as per bank account"
                    value={step6Data.account_holder_name}
                    onChange={(e) => setStep6Data({ ...step6Data, account_holder_name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Bank Name</Label>
                  <Input
                    placeholder="e.g. HDFC Bank / ICICI Bank"
                    value={step6Data.bank_name}
                    onChange={(e) => setStep6Data({ ...step6Data, bank_name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Account Number *</Label>
                  <Input
                    placeholder="Bank account number"
                    value={step6Data.account_number}
                    onChange={(e) => setStep6Data({ ...step6Data, account_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">IFSC Code *</Label>
                  <Input
                    placeholder="e.g. HDFC0001234"
                    value={step6Data.ifsc_code}
                    onChange={(e) => setStep6Data({ ...step6Data, ifsc_code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(5)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep6} className="gradient-bg gap-2 text-xs">
                  {isSavingStep6 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 7: TAX & PF */}
          {activeStep === 7 && (
            <form onSubmit={handleSaveStep7} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 7 — Tax Regime & PF Declaration</h3>
                <p className="text-xs text-muted-foreground">Select income tax regime and provident fund identifiers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Income Tax Regime</Label>
                  <Select value={step7Data.tax_regime} onValueChange={(val) => setStep7Data({ ...step7Data, tax_regime: val })}>
                    <SelectTrigger><SelectValue placeholder="Select Regime" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Regime">New Tax Regime (Default)</SelectItem>
                      <SelectItem value="Old Regime">Old Tax Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">UAN (Universal Account Number)</Label>
                  <Input
                    placeholder="12-digit UAN"
                    value={step7Data.uan_number}
                    onChange={(e) => setStep7Data({ ...step7Data, uan_number: e.target.value })}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Nominee Name for PF/Insurance</Label>
                  <Input
                    placeholder="Nominee full name"
                    value={step7Data.nominee_name}
                    onChange={(e) => setStep7Data({ ...step7Data, nominee_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(6)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep7} className="gradient-bg gap-2 text-xs">
                  {isSavingStep7 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 8: DOCUMENT UPLOAD */}
          {activeStep === 8 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 8 — Document Verification</h3>
                <p className="text-xs text-muted-foreground">Upload scanned PDFs or images of required onboarding documents.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Aadhaar Card", "PAN Card", "Degree Certificate", "Bank Cancelled Cheque"].map((docType) => (
                  <div key={docType} className="p-4 rounded-xl bg-secondary/20 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{docType}</span>
                      <Label htmlFor={`doc-${docType}`} className="cursor-pointer text-[11px] text-primary font-bold hover:underline flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </Label>
                      <input
                        id={`doc-${docType}`}
                        type="file"
                        accept="application/pdf,image/png,image/jpeg"
                        onChange={(e) => handleFileUpload(e, docType)}
                        className="hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Uploaded Files Table */}
              {uploadedDocs.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-foreground">Uploaded Documents ({uploadedDocs.length})</h4>
                  <div className="space-y-1.5">
                    {uploadedDocs.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-foreground">{doc.name || doc.type}</span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{doc.status || "Uploaded"}</Badge>
                        </div>
                        <button type="button" onClick={() => handleDeleteDocument(doc.id)} className="text-destructive hover:text-destructive/80 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No documents uploaded yet.</p>
              )}

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(7)} className="text-xs">Back</Button>
                <Button type="button" onClick={handleSaveStep8} disabled={isCompletingStep8 || isUploadingDoc} className="gradient-bg gap-2 text-xs">
                  {isCompletingStep8 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 9: POLICIES & NDA SIGN-OFF */}
          {activeStep === 9 && (
            <form onSubmit={handleSaveStep9} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 9 — NDA & Corporate Policy Sign-off</h3>
                <p className="text-xs text-muted-foreground">Acknowledge corporate security policies and provide digital sign-off.</p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="nda"
                    checked={step9Data.nda_acknowledged}
                    onChange={(e) => setStep9Data({ ...step9Data, nda_acknowledged: e.target.checked })}
                    className="mt-0.5"
                    required
                  />
                  <Label htmlFor="nda" className="text-xs font-semibold cursor-pointer">
                    I agree to the Non-Disclosure Agreement (NDA) and Intellectual Property Assignment terms of OFC360.
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="code"
                    checked={step9Data.code_of_conduct_acknowledged}
                    onChange={(e) => setStep9Data({ ...step9Data, code_of_conduct_acknowledged: e.target.checked })}
                    className="mt-0.5"
                    required
                  />
                  <Label htmlFor="code" className="text-xs font-semibold cursor-pointer">
                    I acknowledge the Workplace Code of Conduct, Anti-Harassment Policy, and Information Security Directives.
                  </Label>
                </div>

                <div className="space-y-1 pt-2">
                  <Label className="text-xs font-semibold">Type Full Legal Name as Electronic Signature *</Label>
                  <Input
                    placeholder="Full Legal Signature"
                    value={step9Data.signature_name}
                    onChange={(e) => setStep9Data({ ...step9Data, signature_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveStep(8)} className="text-xs">Back</Button>
                <Button type="submit" disabled={isSavingStep9 || isCompletingOnboarding} className="gradient-bg gap-2 text-xs">
                  {isSavingStep9 || isCompletingOnboarding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Complete Onboarding</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
