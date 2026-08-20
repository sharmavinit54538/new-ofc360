import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrict(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 1. PAYROLL STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/payroll/payrollRunTypes.ts'), `
export interface PayrollRun {
  id: string; month: string; year: number; processedEmpCount: number;
  grossTotal: number; netTotal: number; status: "Draft" | "Processing" | "Approved" | "Disbursed";
  processedAt: string;
}
export interface SalaryStructure {
  id: string; gradeName: string; basicPct: number; hraPct: number; daPct: number;
  specialAllowancePct: number; conveyance: number; lta: number;
}
export interface PayslipItem {
  id: string; employeeId: string; employeeName: string; department: string;
  month: string; year: number; basic: number; hra: number; specialAllowance: number;
  pfDeduction: number; ptDeduction: number; tdsDeduction: number; netSalary: number;
  status: "Generated" | "Sent to Employee" | "Downloaded";
}
`);

writeStrict(path.join(root, 'src/stores/payroll/reimbursementBonusTypes.ts'), `
export interface ReimbursementClaim {
  id: string; employeeId: string; employeeName: string; category: string;
  amount: number; description: string; status: "Pending" | "Approved" | "Rejected"; submittedAt: string;
}
export interface BonusPayout {
  id: string; employeeId: string; employeeName: string; type: string;
  amount: number; month: string; status: "Draft" | "Approved" | "Paid";
}
`);

writeStrict(path.join(root, 'src/stores/payroll/taxAdvanceTypes.ts'), `
export interface SalaryAdvanceLoan {
  id: string; employeeId: string; employeeName: string; requestedAmount: number;
  approvedAmount: number; emiMonthly: number; tenureMonths: number; remainingAmount: number;
  status: "Pending" | "Approved" | "Rejected" | "Active" | "Repaid"; appliedAt: string;
}
export interface TaxDeclaration {
  employeeId: string; employeeName: string; regime: "New" | "Old";
  section80C: number; section80D: number; hraExemption: number; homeLoanInterest: number;
  status: "Submitted" | "Verified" | "Locked";
}
export interface ComplianceFiling { id: string; period: string; type: "PF (ECR)" | "ESIC" | "PT Return" | "TDS (24Q)"; dueDate: string; filedDate?: string; amount: number; challanNumber?: string; status: "Pending" | "Filed" | "Overdue"; }
`);

writeStrict(path.join(root, 'src/stores/payroll/mockPayrollData.ts'), `
import type { PayrollRun, SalaryStructure } from "./payrollRunTypes";

export const DEFAULT_PAYROLL_RUNS: PayrollRun[] = [
  { id: "PAY-2026-07", month: "July", year: 2026, processedEmpCount: 48, grossTotal: 3420000, netTotal: 2980000, status: "Disbursed", processedAt: "2026-07-31" },
  { id: "PAY-2026-08", month: "August", year: 2026, processedEmpCount: 52, grossTotal: 3750000, netTotal: 3260000, status: "Draft", processedAt: "2026-08-15" },
];
export const DEFAULT_SALARY_STRUCTURES: SalaryStructure[] = [
  { id: "STR-L1", gradeName: "Engineering L1 - Associate", basicPct: 40, hraPct: 20, daPct: 10, specialAllowancePct: 20, conveyance: 5000, lta: 5000 },
  { id: "STR-L2", gradeName: "Engineering L2 - Mid", basicPct: 40, hraPct: 20, daPct: 10, specialAllowancePct: 20, conveyance: 5000, lta: 5000 },
];
`);

writeStrict(path.join(root, 'src/stores/payroll/payrollActions.ts'), `
export const createPayrollActions = (set: any, get: any) => ({
  addPayrollRun: (run: any) => set((s: any) => ({ payrollRuns: [run, ...s.payrollRuns] })),
  updatePayrollRunStatus: (id: string, status: any) => set((s: any) => ({
    payrollRuns: s.payrollRuns.map((r: any) => r.id === id ? { ...r, status } : r)
  })),
  addReimbursementClaim: (c: any) => set((s: any) => ({ reimbursements: [c, ...s.reimbursements] })),
  approveReimbursement: (id: string) => set((s: any) => ({
    reimbursements: s.reimbursements.map((r: any) => r.id === id ? { ...r, status: "Approved" } : r)
  })),
  rejectReimbursement: (id: string) => set((s: any) => ({
    reimbursements: s.reimbursements.map((r: any) => r.id === id ? { ...r, status: "Rejected" } : r)
  })),
  addBonusPayout: (b: any) => set((s: any) => ({ bonuses: [b, ...s.bonuses] })),
  addSalaryAdvance: (adv: any) => set((s: any) => ({ advances: [adv, ...s.advances] })),
});
`);

writeStrict(path.join(root, 'src/stores/payrollStore.ts'), `
import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_PAYROLL_RUNS, DEFAULT_SALARY_STRUCTURES } from "./payroll/mockPayrollData";
import { createPayrollActions } from "./payroll/payrollActions";

export type { PayrollRun, SalaryStructure, PayslipItem } from "./payroll/payrollRunTypes";
export type { ReimbursementClaim, BonusPayout } from "./payroll/reimbursementBonusTypes";
export type { SalaryAdvanceLoan, TaxDeclaration, ComplianceFiling } from "./payroll/taxAdvanceTypes";

export const usePayrollStore = create<any>((set, get) => ({
  payrollRuns: getStoredData("ofc360_payroll_runs_v1", DEFAULT_PAYROLL_RUNS),
  salaryStructures: DEFAULT_SALARY_STRUCTURES, payslips: [],
  reimbursements: [], bonuses: [], advances: [], taxDeclarations: [], complianceFilings: [],
  ...createPayrollActions(set, get),
}));
`);

// -------------------------------------------------------------
// 2. SUPER ADMIN STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/superAdmin/platformEntityTypes.ts'), `
import type { SystemRole } from "@/features/auth/authTypes";

export interface PlatformCompany {
  id: string; name: string; domain?: string | null; plan?: string | null;
  status: "Active" | "Suspended" | "Trial" | string; employeeCount: number;
  hrAdminName?: string; hrAdminEmail?: string; hr_admin?: any; hr_admins?: any[];
  storageUsedGb?: number; mrr: number; createdAt: string; industry?: string; location?: string;
}

export interface PlatformUser {
  id: string; name: string; email: string; companyId: string;
  companyName: string; role: SystemRole; status: "Active" | "Inactive" | "Pending" | string;
  lastLogin: string; createdAt: string;
}

export interface PlatformHRAdmin {
  id: string; name: string; email: string; companyId: string;
  companyName: string; onboardingStatus: "Completed" | "In_Progress" | "Pending" | string;
  phone: string; assignedAt: string; lastActive: string;
}
`);

writeStrict(path.join(root, 'src/stores/superAdmin/platformSystemTypes.ts'), `
export interface PlatformOnboardingItem { id: string; companyName: string; contactName: string; email: string; currentStep: number; totalSteps: number; completionPercentage: number; status: "In_Progress" | "Completed" | "Pending" | string; startedAt: string; lastActivityAt: string; }
export interface SystemLogItem { id: string; timestamp: string; level: "INFO" | "WARN" | "ERROR" | "CRITICAL"; service: string; event: string; companyId?: string; companyName?: string; userEmail?: string; details: string; ipAddress?: string; }
export interface PlatformSubscription { id: string; companyId: string; companyName: string; planName: "Starter" | "Growth" | "Enterprise" | string; billingCycle: "Monthly" | "Annual"; amount: number; status: "Active" | "Past_Due" | "Canceled" | "Trialing" | string; nextBillingDate: string; autoRenew: boolean; seatsTotal: number; seatsUsed: number; }
export interface PlanConfig { id: string; name: string; tag: string; priceMonthly: number; priceAnnual: number; maxEmployees: number; features: string[]; isPopular?: boolean; }
`);

writeStrict(path.join(root, 'src/stores/superAdmin/mockPlatformData.ts'), `
import type { PlatformCompany } from "./platformEntityTypes";

export const INITIAL_MOCK_COMPANIES: PlatformCompany[] = [
  { id: "COMP-001", name: "Acme Global Solutions", domain: "acme.corp", plan: "Enterprise", status: "Active", employeeCount: 1450, hrAdminName: "Sarah Jenkins", hrAdminEmail: "sarah.j@acme.corp", mrr: 145000, createdAt: "2024-01-10", industry: "Technology", location: "Bengaluru, India" },
  { id: "COMP-002", name: "Nexus Healthcare Pvt Ltd", domain: "nexushealth.in", plan: "Growth", status: "Active", employeeCount: 420, hrAdminName: "Vikram Malhotra", hrAdminEmail: "vikram@nexushealth.in", mrr: 42000, createdAt: "2024-02-15", industry: "Healthcare", location: "Mumbai, India" },
];
`);

writeStrict(path.join(root, 'src/stores/superAdmin/superAdminActions.ts'), `
export const createSuperAdminActions = (set: any) => ({
  setCompanies: (companies: any) => set({ companies }),
  addCompany: (comp: any) => set((s: any) => ({ companies: [comp, ...s.companies] })),
  updateCompany: (id: string, updates: any) => set((s: any) => ({
    companies: s.companies.map((c: any) => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCompany: (id: string) => set((s: any) => ({
    companies: s.companies.filter((c: any) => c.id !== id)
  })),
  setUsers: (users: any) => set({ users }),
  addUser: (user: any) => set((s: any) => ({ users: [user, ...s.users] })),
  setHRAdmins: (hrAdmins: any) => set({ hrAdmins }),
});
`);

writeStrict(path.join(root, 'src/stores/superAdminStore.ts'), `
import { create } from "zustand";
import { INITIAL_MOCK_COMPANIES } from "./superAdmin/mockPlatformData";
import { createSuperAdminActions } from "./superAdmin/superAdminActions";

export type { PlatformCompany, PlatformUser, PlatformHRAdmin } from "./superAdmin/platformEntityTypes";
export type { PlatformOnboardingItem, SystemLogItem, PlatformSubscription, PlanConfig } from "./superAdmin/platformSystemTypes";

export const useSuperAdminStore = create<any>((set) => ({
  companies: INITIAL_MOCK_COMPANIES, users: [], hrAdmins: [],
  onboardingList: [], subscriptions: [], systemLogs: [], plans: [],
  ...createSuperAdminActions(set),
}));
`);

// -------------------------------------------------------------
// 3. HR ADMIN ONBOARDING STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/onboarding/onboardingDefaults.ts'), `
export const initialCompany = {
  company_name: "", industry: "", country: "India", city: "", company_size: "",
  timezone: "Asia/Kolkata", address: "", cin_number: "", gst_number: "", pan_number: "",
  tan_number: "", msme_registration_number: "", website: "", official_email: "", official_phone: "",
};
export const initialHRAdmin = {
  first_name: "", last_name: "", profile_photo: "", mobile_number: "",
  designation: "HR Administrator", preferred_language: "English",
};
export const initialBranding = {
  company_logo: "", company_stamp: "", authorized_signatory_name: "",
  authorized_signatory_designation: "", letterhead: "",
};
export const initialPreferences = {
  default_currency: "INR (₹)", default_timezone: "Asia/Kolkata", fiscal_year_start: "April",
  attendance_mode: "Selfie Camera + Geo-fence", require_camera_biometrics: true,
  auto_generate_emp_id: true, emp_id_prefix: "EMP-", default_probation_days: 90,
  default_notice_period_days: 60, enable_ai_recruitment: true, enable_ai_document_scanner: true,
};
`);

writeStrict(path.join(root, 'src/stores/onboarding/onboardingStepActions.ts'), `
export const createStepActions = (set: any, get: any) => ({
  setCompanyDetails: (d: any) => set((s: any) => ({ company: { ...s.company, ...d } })),
  setHRAdminProfile: (p: any) => set((s: any) => ({ hrAdmin: { ...s.hrAdmin, ...p } })),
  setCompanyBranding: (b: any) => set((s: any) => ({ branding: { ...s.branding, ...b } })),
  setOnboardingPreferences: (p: any) => set((s: any) => ({ preferences: { ...s.preferences, ...p } })),
  setStep: (step: number) => set((s: any) => ({ status: { ...s.status, step } })),
  markStepComplete: (step: number) => set((s: any) => {
    const next = Array.from(new Set([...s.status.completedSteps, step]));
    return { status: { ...s.status, completedSteps: next } };
  }),
  completeOnboarding: () => set((s: any) => ({
    status: { ...s.status, isCompleted: true, completedAt: new Date().toISOString() }
  })),
});
`);

writeStrict(path.join(root, 'src/stores/hrAdminOnboardingStore.ts'), `
import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { initialCompany, initialHRAdmin, initialBranding, initialPreferences } from "./onboarding/onboardingDefaults";
import { createStepActions } from "./onboarding/onboardingStepActions";

export const useHRAdminOnboardingStore = create<any>((set, get) => ({
  company: initialCompany, hrAdmin: initialHRAdmin, branding: initialBranding,
  preferences: initialPreferences,
  status: { step: 1, isCompleted: false, completedSteps: [1] },
  workflows: [], newHires: [],
  ...createStepActions(set, get),
}));
`);

console.log('Modularized payrollStore.ts, superAdminStore.ts, hrAdminOnboardingStore.ts successfully!');
