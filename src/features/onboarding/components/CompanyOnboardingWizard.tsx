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
  Building2,
  UserCheck,
  Settings2,
  Network,
  Award,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { step: 1, title: "Company Profile", icon: Building2 },
  { step: 2, title: "Admin Profile", icon: UserCheck },
  { step: 3, title: "HR Settings", icon: Settings2 },
  { step: 4, title: "Departments", icon: Network },
  { step: 5, title: "Designations", icon: Award },
  { step: 6, title: "Invite Employees", icon: UserPlus },
  { step: 7, title: "Complete Setup", icon: CheckCircle2 },
];

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
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentWizardStep === s.step;
            const isDone = currentWizardStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => dispatch(setCurrentWizardStep(s.step))}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium text-center ${
                  isActive
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/40"
                    : isDone
                    ? "bg-slate-800/40 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate w-full">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
        {isLoadingProgress ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading onboarding progress...</p>
          </div>
        ) : (
          <>
            {/* Step 1: Company Profile */}
            {currentWizardStep === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" /> Step 1: Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyForm.company_name}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, company_name: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="Acme Technologies Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={companyForm.industry}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, industry: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="Software & IT Services"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={companyForm.website}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, website: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="https://acme.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Headquarters City
                    </label>
                    <input
                      type="text"
                      value={companyForm.city}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, city: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="San Francisco"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving1}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Admin Profile */}
            {currentWizardStep === 2 && (
              <form onSubmit={handleNextStep2} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" /> Step 2: Admin Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminForm.first_name}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, first_name: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminForm.last_name}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, last_name: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, email: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={adminForm.phone}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, phone: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
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
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: HR Settings */}
            {currentWizardStep === 3 && (
              <form onSubmit={handleNextStep3} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-indigo-400" /> Step 3: HR System Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Leave Year Cycle Start
                    </label>
                    <select
                      value={hrSettingsForm.leave_year_start}
                      onChange={(e) =>
                        setHrSettingsForm({
                          ...hrSettingsForm,
                          leave_year_start: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="January 1">January 1st (Calendar Year)</option>
                      <option value="April 1">April 1st (Financial Year)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <input
                      type="checkbox"
                      id="docVerify"
                      checked={hrSettingsForm.require_document_verification}
                      onChange={(e) =>
                        setHrSettingsForm({
                          ...hrSettingsForm,
                          require_document_verification: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="docVerify" className="text-sm text-slate-300 cursor-pointer">
                      Require mandatory HR approval for uploaded employee documents
                    </label>
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
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Departments */}
            {currentWizardStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Network className="w-5 h-5 text-indigo-400" /> Step 4: Configure Departments
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="Add new department (e.g., Operations)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDept.trim()) {
                        setDepartments([...departments, newDept.trim()]);
                        setNewDept("");
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-950/60 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-slate-200">{dept}</span>
                      <button
                        onClick={() =>
                          setDepartments(departments.filter((_, i) => i !== index))
                        }
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
                    onClick={handleNextStep4}
                    disabled={isSaving4}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Designations */}
            {currentWizardStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" /> Step 5: Configure Designations
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    placeholder="Add designation (e.g., Senior Developer)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDesig.trim()) {
                        setDesignations([...designations, newDesig.trim()]);
                        setNewDesig("");
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                  {designations.map((desig, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-950/60 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-slate-200">{desig}</span>
                      <button
                        onClick={() =>
                          setDesignations(designations.filter((_, i) => i !== index))
                        }
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
                    onClick={handleNextStep5}
                    disabled={isSaving5}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Invite Employees */}
            {currentWizardStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" /> Step 6: Bulk Invite Initial Team
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (inviteEmail.trim()) {
                          setInvites([
                            ...invites,
                            {
                              email: inviteEmail.trim(),
                              name: inviteName.trim() || "Team Member",
                              role: "Employee",
                              department: departments[0] || "General",
                            },
                          ]);
                          setInviteEmail("");
                          setInviteName("");
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                  {invites.map((inv, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-200">
                          {inv.name} ({inv.email})
                        </div>
                        <div className="text-xs text-slate-500">
                          Role: {inv.role} • Dept: {inv.department}
                        </div>
                      </div>
                      <button
                        onClick={() => setInvites(invites.filter((_, i) => i !== idx))}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
                    onClick={handleNextStep6}
                    disabled={isSaving6}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
                  >
                    Save & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Finalize */}
            {currentWizardStep === 7 && (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  Ready to Finalize Onboarding Setup
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  All 6 preceding setup steps are configured. Click below to activate tenant
                  onboarding workspace.
                </p>

                <div className="flex justify-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => dispatch(setCurrentWizardStep(6))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Review Step 6
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={isSaving7}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                  >
                    {isSaving7 ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finalizing...
                      </>
                    ) : (
                      <>
                        Complete Onboarding <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};