import type { Role } from "@/stores/authStore";
import type {
  Employee,
  Candidate,
  LeaveRequest,
  AttendanceRecord,
  PayrollRow,
  Department
} from "@/types/hr";

import { formatCurrency } from "@/utils/currency";
import { usePayrollStore } from "@/stores/payrollStore";

export type { Employee, Candidate, LeaveRequest, AttendanceRecord, PayrollRow, Department };

export const fmtMoney = (n: number) => {
  const currency = usePayrollStore.getState().settings?.currency;
  return formatCurrency(n, currency);
};

export const stageColor: Record<string, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Interview: "bg-primary/10 text-primary border-primary/20",
  Offer: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hired: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export const employees: Employee[] = [];
export const candidates: Candidate[] = [];
export const weeklyAttendance: { d: string; present: number; remote: number; absent: number }[] = [];
export const myAttendance: AttendanceRecord[] = [];
export const payrollRows: PayrollRow[] = [];
export const payrollTrend: { m: string; v: number }[] = [];

export const myPayslip = {
  base: 0,
  bonus: 0,
  deductions: 0,
  net: 0,
  payDate: "—",
};

export const leaveRequests: LeaveRequest[] = [];

export const departmentSplit: { name: string; value: number }[] = [];

export const hiringTrend = [
  { month: "Jan", hired: 0, left: 0 },
  { month: "Feb", hired: 0, left: 0 },
  { month: "Mar", hired: 0, left: 0 },
  { month: "Apr", hired: 0, left: 0 },
  { month: "May", hired: 0, left: 0 },
  { month: "Jun", hired: 0, left: 0 },
];

export const aiInsightsByRole: Record<Role, { tone: "positive" | "warn" | "info" | "primary"; text: string }[]> = {
  super_admin: [
    { tone: "positive", text: "Multi-tenant platform infrastructure 100% operational." },
    { tone: "info", text: "Zero tenant security anomalies detected." },
  ],
  admin: [
    { tone: "positive", text: "OFC360 Workforce Intelligence connected and ready." },
    { tone: "info", text: "Real-time compliance monitoring active." },
  ],
  hr_admin: [
    { tone: "positive", text: "OFC360 Workforce Intelligence connected and ready." },
    { tone: "info", text: "Real-time compliance monitoring active." },
  ],
  cxo: [
    { tone: "positive", text: "Executive workforce forecasting synchronized." },
  ],
  it_admin: [
    { tone: "positive", text: "System security and identity governance ready." },
  ],
  manager: [
    { tone: "positive", text: "Team performance metrics synchronized." },
  ],
  employee: [
    { tone: "positive", text: "Self-service time-off and compensation portal active." },
  ],
};