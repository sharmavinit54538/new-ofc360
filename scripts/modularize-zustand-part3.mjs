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
// 1. ATS STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/ats/atsTypes.ts'), `
import type { Requisition, JobOpening, Candidate, Interview, Scorecard, OfferLetter, TalentPoolCandidate, EmployeeReferral, VendorAgency, VendorCandidateSubmission, AutomationRule, OnboardingBridgeRecord, AuditLogItem } from "@/types/ats";

export interface ATSDataCollections {
  requisitions: Requisition[]; jobs: JobOpening[]; candidates: Candidate[];
  interviews: Interview[]; scorecards: Scorecard[]; offers: OfferLetter[];
  talentPool: TalentPoolCandidate[]; referrals: EmployeeReferral[];
  vendors: VendorAgency[]; vendorSubmissions: VendorCandidateSubmission[];
  automations: AutomationRule[]; onboardingRecords: OnboardingBridgeRecord[];
  auditLogs: AuditLogItem[]; selectedCandidateId: string | null; activeTab: string;
}
`);

writeStrict(path.join(root, 'src/stores/ats/atsDefaults.ts'), `
import type { ATSDataCollections } from "./atsTypes";
import { getStoredData } from "@/utils/storage";

export const getInitialAtsData = (): ATSDataCollections => ({
  requisitions: getStoredData("hr_nexus_ats_enterprise_v1_reqs", []),
  jobs: getStoredData("hr_nexus_ats_enterprise_v1_jobs", []),
  candidates: getStoredData("hr_nexus_ats_enterprise_v1_cands", []),
  interviews: [], scorecards: [], offers: [], talentPool: [], referrals: [],
  vendors: [], vendorSubmissions: [], automations: [], onboardingRecords: [],
  auditLogs: [], selectedCandidateId: null, activeTab: "requisitions",
});
`);

writeStrict(path.join(root, 'src/stores/ats/atsActions.ts'), `
export const createAtsActions = (set: any, get: any) => ({
  setActiveTab: (activeTab: string) => set({ activeTab }),
  setSelectedCandidateId: (selectedCandidateId: string | null) => set({ selectedCandidateId }),
  addRequisition: (req: any) => set((s: any) => ({ requisitions: [req, ...s.requisitions] })),
  updateRequisitionStatus: (id: string, status: any) => set((s: any) => ({ requisitions: s.requisitions.map((r: any) => r.id === id ? { ...r, status } : r) })),
  addJob: (job: any) => set((s: any) => ({ jobs: [job, ...s.jobs] })),
  updateJobStatus: (id: string, status: any) => set((s: any) => ({ jobs: s.jobs.map((j: any) => j.id === id ? { ...j, status } : j) })),
  addCandidate: (c: any) => set((s: any) => ({ candidates: [c, ...s.candidates] })),
  updateCandidateStage: (id: string, stage: any) => set((s: any) => ({ candidates: s.candidates.map((c: any) => c.id === id ? { ...c, stage } : c) })),
  addInterview: (inv: any) => set((s: any) => ({ interviews: [inv, ...s.interviews] })),
  addScorecard: (sc: any) => set((s: any) => ({ scorecards: [sc, ...s.scorecards] })),
  addOffer: (off: any) => set((s: any) => ({ offers: [off, ...s.offers] })),
});
`);

writeStrict(path.join(root, 'src/stores/atsStore.ts'), `
import { create } from "zustand";
import type { ATSDataCollections } from "./ats/atsTypes";
import { getInitialAtsData } from "./ats/atsDefaults";
import { createAtsActions } from "./ats/atsActions";

export type { ATSDataCollections as ATSState };

export const useATSStore = create<ATSDataCollections & any>((set, get) => ({
  ...getInitialAtsData(),
  ...createAtsActions(set, get),
}));
`);

// -------------------------------------------------------------
// 2. ATTENDANCE STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/attendance/punchTypes.ts'), `
export interface PunchRecord {
  id: string; employeeId: string; employeeName: string; department: string;
  timestamp: string; date?: string; companyId?: string;
  type: "Check-In" | "Check-Out" | "Break-Start" | "Break-Resume";
  method: "Selfie Camera"; location: string;
  workHours?: string; breakHours?: string; breakDurationMins?: number;
  netWorkHours?: string; lateMinutes?: number; earlyMinutes?: number;
  overtimeHours?: string; taskNotes?: string; regularized?: boolean;
  status: "On Time" | "Late" | "Overtime" | "Half Day" | "Early Departure" | "Regularized" | "Missing Punch" | "On Leave" | "Holiday" | "Week Off";
}
`);

writeStrict(path.join(root, 'src/stores/attendance/shiftHolidayTypes.ts'), `
export interface ShiftTemplate {
  id: string; name: string; startTime: string; endTime: string;
  gracePeriodMins: number; halfDayHours: number; fullDayHours: number;
  breakDurationMins: number; department: string;
}

export interface RosterItem {
  id: string; employeeId: string; employeeName: string; department: string;
  shiftName: string; timing: string; dayOfWeek: string; date: string;
}

export interface HolidayItem { id: string; name: string; date: string; dayOfWeek: string; type: "National" | "Regional" | "Optional"; mandatory: boolean; }
export interface LeaveBalanceItem { employeeId: string; employeeName: string; casualLeavesRemaining: number; sickLeavesRemaining: number; earnedLeavesRemaining: number; }
`);

writeStrict(path.join(root, 'src/stores/attendance/regularizationTypes.ts'), `
export interface RegularizationRequest {
  id: string; employeeId: string; employeeName: string; date: string;
  originalCheckIn?: string; originalCheckOut?: string;
  requestedCheckIn: string; requestedCheckOut: string;
  reason: string; status: "Pending" | "Approved" | "Rejected"; appliedAt: string;
}
`);

writeStrict(path.join(root, 'src/stores/attendance/mockAttendanceData.ts'), `
import type { ShiftTemplate, HolidayItem } from "./shiftHolidayTypes";

export const DEFAULT_SHIFTS: ShiftTemplate[] = [
  { id: "SFT-01", name: "General Morning Shift", startTime: "09:00", endTime: "18:00", gracePeriodMins: 15, halfDayHours: 4.5, fullDayHours: 8.0, breakDurationMins: 45, department: "All Departments" },
  { id: "SFT-02", name: "Evening Shift", startTime: "14:00", endTime: "23:00", gracePeriodMins: 15, halfDayHours: 4.5, fullDayHours: 8.0, breakDurationMins: 45, department: "Support & Operations" },
];

export const DEFAULT_HOLIDAYS: HolidayItem[] = [
  { id: "HOL-01", name: "Republic Day", date: "2026-01-26", dayOfWeek: "Monday", type: "National", mandatory: true },
  { id: "HOL-02", name: "Independence Day", date: "2026-08-15", dayOfWeek: "Saturday", type: "National", mandatory: true },
];
`);

writeStrict(path.join(root, 'src/stores/attendance/attendanceActions.ts'), `
export const createAttendanceActions = (set: any, get: any) => ({
  addPunchRecord: (p: any) => set((s: any) => ({ punchRecords: [p, ...s.punchRecords] })),
  regularizePunch: (id: string, updates: any) => set((s: any) => ({
    punchRecords: s.punchRecords.map((x: any) => x.id === id ? { ...x, ...updates, regularized: true, status: "Regularized" } : x)
  })),
  addShiftTemplate: (st: any) => set((s: any) => ({ shiftTemplates: [...s.shiftTemplates, st] })),
  updateShiftTemplate: (id: string, u: any) => set((s: any) => ({
    shiftTemplates: s.shiftTemplates.map((x: any) => x.id === id ? { ...x, ...u } : x)
  })),
  addRegularizationRequest: (req: any) => set((s: any) => ({
    regularizationRequests: [req, ...s.regularizationRequests]
  })),
  approveRegularization: (id: string) => set((s: any) => ({
    regularizationRequests: s.regularizationRequests.map((r: any) => r.id === id ? { ...r, status: "Approved" } : r)
  })),
  rejectRegularization: (id: string) => set((s: any) => ({
    regularizationRequests: s.regularizationRequests.map((r: any) => r.id === id ? { ...r, status: "Rejected" } : r)
  })),
});
`);

writeStrict(path.join(root, 'src/stores/attendanceStore.ts'), `
import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_SHIFTS, DEFAULT_HOLIDAYS } from "./attendance/mockAttendanceData";
import { createAttendanceActions } from "./attendance/attendanceActions";

export type { PunchRecord } from "./attendance/punchTypes";
export type { ShiftTemplate, RosterItem, HolidayItem, LeaveBalanceItem } from "./attendance/shiftHolidayTypes";
export type { RegularizationRequest } from "./attendance/regularizationTypes";

export const useAttendanceStore = create<any>((set, get) => ({
  punchRecords: getStoredData("ofc360_attendance_punches_v1", []),
  shiftTemplates: getStoredData("ofc360_attendance_shifts_v1", DEFAULT_SHIFTS),
  roster: [], holidays: DEFAULT_HOLIDAYS, leaveBalances: [],
  regularizationRequests: getStoredData("ofc360_attendance_regularizations_v1", []),
  ...createAttendanceActions(set, get),
}));
`);

console.log('Modularized atsStore.ts and attendanceStore.ts successfully!');
