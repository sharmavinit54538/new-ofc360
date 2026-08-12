import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";
import {
  CompanyDetails,
  HRAdminProfile,
  CompanyBranding,
  OnboardingPreferences,
  OnboardingStatus,
  CompleteOnboardingData,
  OnboardingWorkflow,
  NewHireOnboardingRecord,
  OnboardingDocumentItem,
  OnboardingTaskItem,
} from "@/types/hrAdminOnboarding";
import {
  validateCIN,
  validateGSTIN,
  validatePAN,
  validateTAN,
  validateMobileNumber,
  cleanString,
} from "@/utils/onboardingValidation";

const STORAGE_KEY_PREFIX = "ofc360_hr_onboarding_v1";

const initialCompany: CompanyDetails = {
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
};

const initialHRAdmin: HRAdminProfile = {
  first_name: "",
  last_name: "",
  profile_photo: "",
  mobile_number: "",
  designation: "HR Administrator",
  preferred_language: "English",
};

const initialBranding: CompanyBranding = {
  company_logo: "",
  company_stamp: "",
  authorized_signatory_name: "",
  authorized_signatory_designation: "",
  letterhead: "",
};

const initialPreferences: OnboardingPreferences = {
  work_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  work_hours: "09:00 - 18:00",
  attendance_telemetry: "Face + Web Check-in",
  payroll_cycle_start: 1,
  notification_channels: ["Email", "In-App"],
};

const initialStatus: OnboardingStatus = {
  current_step: 1,
  completed_steps: [],
  remaining_steps: [1, 2, 3, 4, 5],
  completion_percentage: 0,
  is_completed: false,
};

const initialWorkflows: OnboardingWorkflow[] = [
  { id: "wf-01", name: "Engineering Onboarding Track", department: "Engineering", tasks_count: 8, is_active: true },
  { id: "wf-02", name: "Sales & Marketing Playbook", department: "Sales", tasks_count: 6, is_active: true },
  { id: "wf-03", name: "Executive & Ops Onboarding", department: "Executive", tasks_count: 10, is_active: true },
];

const initialNewHires: NewHireOnboardingRecord[] = [
  { id: "hire-01", name: "Priya Sharma", email: "priya.sharma@example.com", role: "Frontend Engineer", join_date: "2026-04-01", progress: 75, status: "in_progress" },
  { id: "hire-02", name: "Alex Kim", email: "alex.kim@example.com", role: "Product Designer", join_date: "2026-04-05", progress: 40, status: "in_progress" },
  { id: "hire-03", name: "Jordan Lee", email: "jordan.lee@example.com", role: "Data Analyst", join_date: "2026-04-10", progress: 100, status: "completed" },
];

const initialDocuments: OnboardingDocumentItem[] = [
  { id: "doc-01", name: "Aadhar Card", type: "Identity", is_mandatory: true, status: "verified" },
  { id: "doc-02", name: "PAN Card", type: "Tax", is_mandatory: true, status: "verified" },
  { id: "doc-03", name: "Degree Certificate", type: "Education", is_mandatory: true, status: "pending" },
  { id: "doc-04", name: "Previous Offer Letter", type: "Employment", is_mandatory: false, status: "uploaded" },
];

const initialTasks: OnboardingTaskItem[] = [
  { id: "task-01", title: "Background Verification", category: "Security", assigned_to: "HR Team", due_days: 1, is_completed: true },
  { id: "task-02", title: "Document Upload (Aadhar, PAN)", category: "Compliance", assigned_to: "Employee", due_days: 2, is_completed: true },
  { id: "task-03", title: "Email & System Accounts Created", category: "IT", assigned_to: "IT Admin", due_days: 3, is_completed: false },
  { id: "task-04", title: "Welcome Kit & ID Card Issued", category: "Operations", assigned_to: "Admin", due_days: 5, is_completed: false },
];

export interface HRAdminOnboardingStoreState {
  company: CompanyDetails;
  hr_admin: HRAdminProfile;
  branding: CompanyBranding;
  preferences: OnboardingPreferences;
  onboarding: OnboardingStatus;
  workflows: OnboardingWorkflow[];
  newHires: NewHireOnboardingRecord[];
  documents: OnboardingDocumentItem[];
  tasks: OnboardingTaskItem[];
  
  // Storage initialization per company
  loadForCompany: (companyId: string) => void;
  
  // Step Actions
  saveStep: (
    stepIndex: number,
    data: {
      company?: Partial<CompanyDetails>;
      hr_admin?: Partial<HRAdminProfile>;
      branding?: Partial<CompanyBranding>;
      preferences?: Partial<OnboardingPreferences>;
    },
    companyId?: string
  ) => { success: boolean; error?: string; status?: OnboardingStatus };

  completeOnboarding: (companyId?: string) => { success: boolean; error?: string; status?: OnboardingStatus };
  
  // API auxiliary methods
  addWorkflow: (wf: Omit<OnboardingWorkflow, "id">) => void;
  deleteWorkflow: (id: string) => void;
  addNewHire: (hire: Omit<NewHireOnboardingRecord, "id">) => void;
  updateNewHire: (id: string, updates: Partial<NewHireOnboardingRecord>) => void;
  deleteNewHire: (id: string) => void;
  addDocument: (doc: Omit<OnboardingDocumentItem, "id">) => void;
  updateDocument: (id: string, updates: Partial<OnboardingDocumentItem>) => void;
  deleteDocument: (id: string) => void;
  addTask: (task: Omit<OnboardingTaskItem, "id">) => void;
  updateTask: (id: string, updates: Partial<OnboardingTaskItem>) => void;
  deleteTask: (id: string) => void;
  resetOnboardingData: (companyId?: string) => void;
}

export const useHRAdminOnboardingStore = create<HRAdminOnboardingStoreState>((set, get) => ({
  company: initialCompany,
  hr_admin: initialHRAdmin,
  branding: initialBranding,
  preferences: initialPreferences,
  onboarding: initialStatus,
  workflows: initialWorkflows,
  newHires: initialNewHires,
  documents: initialDocuments,
  tasks: initialTasks,

  loadForCompany: (companyId: string) => {
    const key = `${STORAGE_KEY_PREFIX}_${companyId || "default"}`;
    const saved = getStoredData<CompleteOnboardingData | null>(key, null);

    if (saved) {
      set({
        company: saved.company,
        hr_admin: saved.hr_admin,
        branding: saved.branding,
        preferences: saved.preferences || initialPreferences,
        onboarding: saved.onboarding,
      });
    } else {
      set({
        company: initialCompany,
        hr_admin: initialHRAdmin,
        branding: initialBranding,
        preferences: initialPreferences,
        onboarding: initialStatus,
      });
    }
  },

  saveStep: (stepIndex, data, companyId = "default") => {
    const current = get();

    // 1. Validation for step
    if (stepIndex === 1 && data.company) {
      const c = data.company;
      if (!c.company_name?.trim()) return { success: false, error: "Company Name is required." };
      if (!c.industry?.trim()) return { success: false, error: "Industry is required." };
      if (!c.country?.trim()) return { success: false, error: "Country is required." };
      if (!c.city?.trim()) return { success: false, error: "City is required." };
      if (!c.company_size?.trim()) return { success: false, error: "Company Size is required." };
      if (!c.timezone?.trim()) return { success: false, error: "Timezone is required." };
      if (!c.address?.trim()) return { success: false, error: "Address is required." };

      if (!validateCIN(c.cin_number)) return { success: false, error: "Invalid CIN Number format (e.g. U12345MH2020PTC123456)." };
      if (!validateGSTIN(c.gst_number)) return { success: false, error: "Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)." };
      if (!validatePAN(c.pan_number)) return { success: false, error: "Invalid PAN format (e.g. ABCDE1234F)." };
      if (!validateTAN(c.tan_number)) return { success: false, error: "Invalid TAN format (e.g. ABCD12345E)." };
    }

    if (stepIndex === 2 && data.hr_admin) {
      const h = data.hr_admin;
      if (!h.first_name?.trim()) return { success: false, error: "First Name is required." };
      if (!h.last_name?.trim()) return { success: false, error: "Last Name is required." };
      if (!h.mobile_number?.trim()) return { success: false, error: "Mobile Number is required." };
      if (!validateMobileNumber(h.mobile_number)) return { success: false, error: "Invalid Mobile Number format." };
      if (!h.designation?.trim()) return { success: false, error: "Designation is required." };
    }

    if (stepIndex === 3 && data.branding) {
      const b = data.branding;
      if (!b.authorized_signatory_name?.trim()) return { success: false, error: "Authorized Signatory Name is required." };
      if (!b.authorized_signatory_designation?.trim()) return { success: false, error: "Authorized Signatory Designation is required." };
    }

    // 2. Compute updated state transactionally
    const updatedCompany = data.company
      ? { ...current.company, ...data.company }
      : current.company;

    const updatedHRAdmin = data.hr_admin
      ? { ...current.hr_admin, ...data.hr_admin }
      : current.hr_admin;

    const updatedBranding = data.branding
      ? { ...current.branding, ...data.branding }
      : current.branding;

    const updatedPreferences = data.preferences
      ? { ...current.preferences, ...data.preferences }
      : current.preferences;

    // Completed steps set update
    const completedSet = new Set(current.onboarding.completed_steps);
    completedSet.add(stepIndex);
    const completedArr = Array.from(completedSet).sort((a, b) => a - b);

    // Calculate next step
    const allSteps = [1, 2, 3, 4, 5];
    const remainingArr = allSteps.filter((s) => !completedArr.includes(s));
    const nextStep = remainingArr.length > 0 ? Math.min(...remainingArr) : 5;
    const completionPercentage = Math.round((completedArr.length / 5) * 100);

    const updatedStatus: OnboardingStatus = {
      ...current.onboarding,
      current_step: nextStep,
      completed_steps: completedArr,
      remaining_steps: remainingArr,
      completion_percentage: completionPercentage,
    };

    // 3. Persist to storage key
    const payloadToSave: CompleteOnboardingData = {
      company: updatedCompany,
      hr_admin: updatedHRAdmin,
      branding: updatedBranding,
      preferences: updatedPreferences,
      onboarding: updatedStatus,
    };

    const key = `${STORAGE_KEY_PREFIX}_${companyId}`;
    setStoredData(key, payloadToSave);

    set({
      company: updatedCompany,
      hr_admin: updatedHRAdmin,
      branding: updatedBranding,
      preferences: updatedPreferences,
      onboarding: updatedStatus,
    });

    return { success: true, status: updatedStatus };
  },

  completeOnboarding: (companyId = "default") => {
    const current = get();

    // Validate mandatory steps 1, 2, 3
    if (!current.company.company_name || !current.company.industry || !current.company.country || !current.company.city) {
      return { success: false, error: "Step 1 (Company Details) is incomplete." };
    }
    if (!current.hr_admin.first_name || !current.hr_admin.last_name || !current.hr_admin.mobile_number) {
      return { success: false, error: "Step 2 (HR Admin Profile) is incomplete." };
    }
    if (!current.branding.authorized_signatory_name || !current.branding.authorized_signatory_designation) {
      return { success: false, error: "Step 3 (Company Branding) is incomplete." };
    }

    const completedStatus: OnboardingStatus = {
      current_step: 5,
      completed_steps: [1, 2, 3, 4, 5],
      remaining_steps: [],
      completion_percentage: 100,
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    const payloadToSave: CompleteOnboardingData = {
      company: current.company,
      hr_admin: current.hr_admin,
      branding: current.branding,
      preferences: current.preferences,
      onboarding: completedStatus,
    };

    const key = `${STORAGE_KEY_PREFIX}_${companyId}`;
    setStoredData(key, payloadToSave);

    set({ onboarding: completedStatus });
    return { success: true, status: completedStatus };
  },

  addWorkflow: (wf) => {
    const newWf: OnboardingWorkflow = { ...wf, id: `wf_${Date.now()}` };
    set((state) => ({ workflows: [newWf, ...state.workflows] }));
  },
  deleteWorkflow: (id) => {
    set((state) => ({ workflows: state.workflows.filter((w) => w.id !== id) }));
  },

  addNewHire: (hire) => {
    const newRecord: NewHireOnboardingRecord = { ...hire, id: `hire_${Date.now()}` };
    set((state) => ({ newHires: [newRecord, ...state.newHires] }));
  },
  updateNewHire: (id, updates) => {
    set((state) => ({
      newHires: state.newHires.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  },
  deleteNewHire: (id) => {
    set((state) => ({ newHires: state.newHires.filter((h) => h.id !== id) }));
  },

  addDocument: (doc) => {
    const newDoc: OnboardingDocumentItem = { ...doc, id: `doc_${Date.now()}` };
    set((state) => ({ documents: [newDoc, ...state.documents] }));
  },
  updateDocument: (id, updates) => {
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },
  deleteDocument: (id) => {
    set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }));
  },

  addTask: (task) => {
    const newTask: OnboardingTaskItem = { ...task, id: `task_${Date.now()}` };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  resetOnboardingData: (companyId = "default") => {
    const key = `${STORAGE_KEY_PREFIX}_${companyId}`;
    setStoredData(key, null);
    set({
      company: initialCompany,
      hr_admin: initialHRAdmin,
      branding: initialBranding,
      preferences: initialPreferences,
      onboarding: initialStatus,
    });
  },
}));
