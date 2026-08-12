import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  processedEmpCount: number;
  grossTotal: number;
  netTotal: number;
  status: "Draft" | "Processing" | "Approved" | "Disbursed";
  processedAt: string;
}

export interface SalaryStructure {
  id: string;
  gradeName: string;
  basicPct: number;
  hraPct: number;
  daPct: number;
  specialAllowancePct: number;
  conveyance: number;
  lta: number;
}

export interface PayslipItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  pfDeduction: number;
  ptDeduction: number;
  tdsDeduction: number;
  netSalary: number;
  status: "Generated" | "Sent to Employee" | "Downloaded";
}

export interface ReimbursementClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  category: "Fuel & Travel" | "Internet & Phone" | "Client Dinner" | "Office Supplies";
  amount: number;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

export interface BonusPayout {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Performance Bonus" | "Sales Commission" | "Festival Bonus" | "Retention Reward";
  amount: number;
  month: string;
  status: "Pending" | "Approved" | "Paid";
}

export interface StatutoryDeduction {
  id: string;
  name: string;
  type: "PF (Provident Fund)" | "ESI" | "Professional Tax" | "Health Insurance" | "NPS";
  ratePercentage: number;
  fixedAmount: number;
  mandatory: boolean;
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  requestedAmount: number;
  emiMonths: number;
  monthlyEmi: number;
  balanceRemaining: number;
  status: "Pending" | "Approved" | "Active EMI" | "Completed";
  appliedDate: string;
}

export interface OvertimePayment {
  id: string;
  employeeId: string;
  employeeName: string;
  hours: number;
  rateMultiplier: "1.5x (Weekday)" | "2.0x (Weekend/Holiday)";
  totalPayout: number;
  month: string;
  status: "Pending" | "Approved" | "Paid";
}

export interface TaxDeclaration {
  id: string;
  employeeId: string;
  employeeName: string;
  financialYear: string;
  regime: "New Tax Regime (Sec 115BAC)" | "Old Tax Regime (With Exemptions)";
  declared80C: number;
  declared80D: number;
  homeLoanInterest: number;
  status: "Draft" | "Verified" | "Approved";
}

export interface PayrollApproval {
  id: string;
  runMonth: string;
  tier: "Tier 1: HR Executive Draft" | "Tier 2: Finance Verification" | "Tier 3: CXO Final Sign-Off";
  approverName: string;
  status: "Pending" | "Approved" | "Rejected";
  comments?: string;
  updatedAt: string;
}

export interface BankTransferBatch {
  id: string;
  bankName: "HDFC Bank" | "ICICI Bank" | "State Bank of India (SBI)" | "Axis Bank";
  batchReference: string;
  totalAmount: number;
  employeeCount: number;
  fileFormat: "HDFC TXT Format" | "ICICI Corporate CSV" | "SBI Corporate Excel";
  generatedAt: string;
}

export interface StatutoryFiling {
  id: string;
  period: string;
  type: "EPFO Monthly ECR" | "ESIC Monthly Return" | "State Professional Tax Challan";
  totalContribution: number;
  status: "Draft" | "Challan Generated" | "Filed On-Time";
  filingDate: string;
}

export interface PayrollSettings {
  payCycleFrequency: "Monthly" | "Bi-Weekly" | "Weekly";
  attendanceCutoffDay: number;
  salaryDisbursementDay: number;
  currency: string;
  roundingRule: "Nearest Integer" | "Exact Decimals";
}

interface PayrollState {
  runs: PayrollRun[];
  structures: SalaryStructure[];
  payslips: PayslipItem[];
  reimbursements: ReimbursementClaim[];
  bonuses: BonusPayout[];
  deductions: StatutoryDeduction[];
  advances: SalaryAdvance[];
  overtimePays: OvertimePayment[];
  taxDeclarations: TaxDeclaration[];
  approvals: PayrollApproval[];
  bankTransfers: BankTransferBatch[];
  complianceFilings: StatutoryFiling[];
  settings: PayrollSettings;

  // Actions
  addRun: (run: Omit<PayrollRun, "id" | "processedAt">) => void;
  addStructure: (str: Omit<SalaryStructure, "id">) => void;
  deleteStructure: (id: string) => void;
  addPayslip: (slip: Omit<PayslipItem, "id">) => void;
  addReimbursement: (claim: Omit<ReimbursementClaim, "id" | "submittedAt">) => void;
  updateReimbursementStatus: (id: string, status: "Approved" | "Rejected") => void;
  addBonus: (bonus: Omit<BonusPayout, "id">) => void;
  updateBonusStatus: (id: string, status: "Approved" | "Paid") => void;
  addDeduction: (ded: Omit<StatutoryDeduction, "id">) => void;
  deleteDeduction: (id: string) => void;
  addAdvance: (adv: Omit<SalaryAdvance, "id" | "appliedDate">) => void;
  updateAdvanceStatus: (id: string, status: "Approved" | "Active EMI" | "Completed") => void;
  addOvertimePay: (ot: Omit<OvertimePayment, "id">) => void;
  updateOvertimePayStatus: (id: string, status: "Approved" | "Paid") => void;
  addTaxDeclaration: (tax: Omit<TaxDeclaration, "id">) => void;
  updateTaxDeclarationStatus: (id: string, status: "Verified" | "Approved") => void;
  addApprovalTier: (app: Omit<PayrollApproval, "id" | "updatedAt">) => void;
  updateApprovalStatus: (id: string, status: "Approved" | "Rejected", comment?: string) => void;
  addBankTransfer: (batch: Omit<BankTransferBatch, "id" | "generatedAt">) => void;
  addComplianceFiling: (filing: Omit<StatutoryFiling, "id" | "filingDate">) => void;
  updateSettings: (newSettings: Partial<PayrollSettings>) => void;
}

const STORAGE_KEYS = {
  RUNS: "ofc360_pr_runs_v3",
  STRUCTURES: "ofc360_pr_struct_v3",
  PAYSLIPS: "ofc360_pr_slips_v3",
  REIMBURSEMENTS: "ofc360_pr_reimb_v3",
  BONUSES: "ofc360_pr_bonuses_v3",
  DEDUCTIONS: "ofc360_pr_ded_v3",
  ADVANCES: "ofc360_pr_advances_v3",
  OVERTIMES: "ofc360_pr_overtimes_v3",
  TAX: "ofc360_pr_tax_v3",
  APPROVALS: "ofc360_pr_app_v3",
  BANK: "ofc360_pr_bank_v3",
  FILINGS: "ofc360_pr_filings_v3",
  SETTINGS: "ofc360_pr_settings_v3",
};

const DEFAULT_SETTINGS: PayrollSettings = {
  payCycleFrequency: "Monthly",
  attendanceCutoffDay: 25,
  salaryDisbursementDay: 1,
  currency: "INR (₹)",
  roundingRule: "Nearest Integer",
};

const DEFAULT_STRUCTURES: SalaryStructure[] = [
  {
    id: "GRD-01",
    gradeName: "Grade A: Senior Leadership & Executives",
    basicPct: 50,
    hraPct: 20,
    daPct: 10,
    specialAllowancePct: 20,
    conveyance: 1600,
    lta: 1250,
  },
  {
    id: "GRD-02",
    gradeName: "Grade B: Engineering & Tech Leads",
    basicPct: 50,
    hraPct: 20,
    daPct: 10,
    specialAllowancePct: 20,
    conveyance: 1600,
    lta: 1250,
  },
  {
    id: "GRD-03",
    gradeName: "Grade C: Associates & Operations",
    basicPct: 50,
    hraPct: 20,
    daPct: 10,
    specialAllowancePct: 20,
    conveyance: 1600,
    lta: 1250,
  },
];

const DEFAULT_DEDUCTIONS: StatutoryDeduction[] = [
  {
    id: "DED-01",
    name: "Employees' Provident Fund (EPF)",
    type: "PF (Provident Fund)",
    ratePercentage: 12.0,
    fixedAmount: 0,
    mandatory: true,
  },
  {
    id: "DED-02",
    name: "Employees' State Insurance (ESIC)",
    type: "ESI",
    ratePercentage: 0.75,
    fixedAmount: 0,
    mandatory: true,
  },
  {
    id: "DED-03",
    name: "State Professional Tax (PT)",
    type: "Professional Tax",
    ratePercentage: 0,
    fixedAmount: 200,
    mandatory: true,
  },
  {
    id: "DED-04",
    name: "Corporate Health Cover (Group Mediclaim)",
    type: "Health Insurance",
    ratePercentage: 0,
    fixedAmount: 500,
    mandatory: false,
  },
];

const DEFAULT_APPROVALS: PayrollApproval[] = [
  {
    id: "APP-01",
    runMonth: "August 2026",
    tier: "Tier 1: HR Executive Draft",
    approverName: "Sarah Jenkins (HR Ops)",
    status: "Approved",
    comments: "Monthly attendance & LOP verified against roster.",
    updatedAt: "2026-08-01",
  },
  {
    id: "APP-02",
    runMonth: "August 2026",
    tier: "Tier 2: Finance Verification",
    approverName: "Rajesh Malhotra (Finance Lead)",
    status: "Approved",
    comments: "Tax declarations and TDS calculations audited.",
    updatedAt: "2026-08-02",
  },
  {
    id: "APP-03",
    runMonth: "August 2026",
    tier: "Tier 3: CXO Final Sign-Off",
    approverName: "Vinit Sharma (Co-Founder)",
    status: "Pending",
    comments: "Awaiting final bank payout authorization.",
    updatedAt: "2026-08-03",
  },
];

export const usePayrollStore = create<PayrollState>((set, get) => ({
  runs: getStoredData<PayrollRun[]>(STORAGE_KEYS.RUNS, []),
  structures: getStoredData<SalaryStructure[]>(STORAGE_KEYS.STRUCTURES, DEFAULT_STRUCTURES),
  payslips: getStoredData<PayslipItem[]>(STORAGE_KEYS.PAYSLIPS, []),
  reimbursements: getStoredData<ReimbursementClaim[]>(STORAGE_KEYS.REIMBURSEMENTS, []),
  bonuses: getStoredData<BonusPayout[]>(STORAGE_KEYS.BONUSES, []),
  deductions: getStoredData<StatutoryDeduction[]>(STORAGE_KEYS.DEDUCTIONS, DEFAULT_DEDUCTIONS),
  advances: getStoredData<SalaryAdvance[]>(STORAGE_KEYS.ADVANCES, []),
  overtimePays: getStoredData<OvertimePayment[]>(STORAGE_KEYS.OVERTIMES, []),
  taxDeclarations: getStoredData<TaxDeclaration[]>(STORAGE_KEYS.TAX, []),
  approvals: getStoredData<PayrollApproval[]>(STORAGE_KEYS.APPROVALS, DEFAULT_APPROVALS),
  bankTransfers: getStoredData<BankTransferBatch[]>(STORAGE_KEYS.BANK, []),
  complianceFilings: getStoredData<StatutoryFiling[]>(STORAGE_KEYS.FILINGS, []),
  settings: getStoredData<PayrollSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),

  addRun: (run) => {
    const newRun: PayrollRun = {
      id: `PRUN-${Date.now().toString().slice(-5)}`,
      processedAt: new Date().toLocaleDateString(),
      ...run,
    };
    const updated = [newRun, ...get().runs];
    setStoredData(STORAGE_KEYS.RUNS, updated);
    set({ runs: updated });
  },

  addStructure: (str) => {
    const newStr: SalaryStructure = {
      id: `GRD-${Date.now().toString().slice(-4)}`,
      ...str,
    };
    const updated = [...get().structures, newStr];
    setStoredData(STORAGE_KEYS.STRUCTURES, updated);
    set({ structures: updated });
  },
  deleteStructure: (id) => {
    const updated = get().structures.filter((s) => s.id !== id);
    setStoredData(STORAGE_KEYS.STRUCTURES, updated);
    set({ structures: updated });
  },

  addPayslip: (slip) => {
    const newSlip: PayslipItem = {
      id: `SLIP-${Date.now().toString().slice(-5)}`,
      ...slip,
    };
    const updated = [newSlip, ...get().payslips];
    setStoredData(STORAGE_KEYS.PAYSLIPS, updated);
    set({ payslips: updated });
  },

  addReimbursement: (claim) => {
    const newClaim: ReimbursementClaim = {
      id: `RMB-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toLocaleDateString(),
      ...claim,
    };
    const updated = [newClaim, ...get().reimbursements];
    setStoredData(STORAGE_KEYS.REIMBURSEMENTS, updated);
    set({ reimbursements: updated });
  },
  updateReimbursementStatus: (id, status) => {
    const updated = get().reimbursements.map((r) => (r.id === id ? { ...r, status } : r));
    setStoredData(STORAGE_KEYS.REIMBURSEMENTS, updated);
    set({ reimbursements: updated });
  },

  addBonus: (bonus) => {
    const newBonus: BonusPayout = {
      id: `BNS-${Date.now().toString().slice(-4)}`,
      ...bonus,
    };
    const updated = [newBonus, ...get().bonuses];
    setStoredData(STORAGE_KEYS.BONUSES, updated);
    set({ bonuses: updated });
  },
  updateBonusStatus: (id, status) => {
    const updated = get().bonuses.map((b) => (b.id === id ? { ...b, status } : b));
    setStoredData(STORAGE_KEYS.BONUSES, updated);
    set({ bonuses: updated });
  },

  addDeduction: (ded) => {
    const newDed: StatutoryDeduction = {
      id: `DED-${Date.now().toString().slice(-4)}`,
      ...ded,
    };
    const updated = [...get().deductions, newDed];
    setStoredData(STORAGE_KEYS.DEDUCTIONS, updated);
    set({ deductions: updated });
  },
  deleteDeduction: (id) => {
    const updated = get().deductions.filter((d) => d.id !== id);
    setStoredData(STORAGE_KEYS.DEDUCTIONS, updated);
    set({ deductions: updated });
  },

  addAdvance: (adv) => {
    const newAdv: SalaryAdvance = {
      id: `ADV-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toLocaleDateString(),
      ...adv,
    };
    const updated = [newAdv, ...get().advances];
    setStoredData(STORAGE_KEYS.ADVANCES, updated);
    set({ advances: updated });
  },
  updateAdvanceStatus: (id, status) => {
    const updated = get().advances.map((a) => (a.id === id ? { ...a, status } : a));
    setStoredData(STORAGE_KEYS.ADVANCES, updated);
    set({ advances: updated });
  },

  addOvertimePay: (ot) => {
    const newOt: OvertimePayment = {
      id: `OTP-${Date.now().toString().slice(-4)}`,
      ...ot,
    };
    const updated = [newOt, ...get().overtimePays];
    setStoredData(STORAGE_KEYS.OVERTIMES, updated);
    set({ overtimePays: updated });
  },
  updateOvertimePayStatus: (id, status) => {
    const updated = get().overtimePays.map((o) => (o.id === id ? { ...o, status } : o));
    setStoredData(STORAGE_KEYS.OVERTIMES, updated);
    set({ overtimePays: updated });
  },

  addTaxDeclaration: (tax) => {
    const newTax: TaxDeclaration = {
      id: `TAX-${Date.now().toString().slice(-4)}`,
      ...tax,
    };
    const updated = [newTax, ...get().taxDeclarations];
    setStoredData(STORAGE_KEYS.TAX, updated);
    set({ taxDeclarations: updated });
  },
  updateTaxDeclarationStatus: (id, status) => {
    const updated = get().taxDeclarations.map((t) => (t.id === id ? { ...t, status } : t));
    setStoredData(STORAGE_KEYS.TAX, updated);
    set({ taxDeclarations: updated });
  },

  addApprovalTier: (app) => {
    const newApp: PayrollApproval = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      updatedAt: new Date().toLocaleDateString(),
      ...app,
    };
    const updated = [newApp, ...get().approvals];
    setStoredData(STORAGE_KEYS.APPROVALS, updated);
    set({ approvals: updated });
  },
  updateApprovalStatus: (id, status, comment) => {
    const updated = get().approvals.map((a) =>
      a.id === id
        ? {
            ...a,
            status,
            comments: comment || (status === "Approved" ? "Approved by reviewer" : "Returned for revision"),
            updatedAt: new Date().toLocaleDateString(),
          }
        : a
    );
    setStoredData(STORAGE_KEYS.APPROVALS, updated);
    set({ approvals: updated });
  },

  addBankTransfer: (batch) => {
    const newBatch: BankTransferBatch = {
      id: `BNK-${Date.now().toString().slice(-4)}`,
      generatedAt: new Date().toLocaleDateString(),
      ...batch,
    };
    const updated = [newBatch, ...get().bankTransfers];
    setStoredData(STORAGE_KEYS.BANK, updated);
    set({ bankTransfers: updated });
  },

  addComplianceFiling: (filing) => {
    const newFiling: StatutoryFiling = {
      id: `FLG-${Date.now().toString().slice(-4)}`,
      filingDate: new Date().toLocaleDateString(),
      ...filing,
    };
    const updated = [newFiling, ...get().complianceFilings];
    setStoredData(STORAGE_KEYS.FILINGS, updated);
    set({ complianceFilings: updated });
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    setStoredData(STORAGE_KEYS.SETTINGS, updated);
    set({ settings: updated });
  },
}));
