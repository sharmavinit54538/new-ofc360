import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface PunchRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timestamp: string; // e.g. "09:12 AM" or "09:12"
  date?: string; // e.g. "2026-08-12"
  companyId?: string;
  type: "Check-In" | "Check-Out" | "Break-Start" | "Break-Resume";
  method: "Selfie Camera";
  location: string;
  workHours?: string;
  breakHours?: string;
  breakDurationMins?: number;
  netWorkHours?: string;
  lateMinutes?: number;
  earlyMinutes?: number;
  overtimeHours?: string;
  taskNotes?: string;
  regularized?: boolean;
  status:
    | "On Time"
    | "Late"
    | "Overtime"
    | "Half Day"
    | "Early Departure"
    | "Regularized"
    | "Missing Punch"
    | "On Leave"
    | "Holiday"
    | "Week Off";
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string; // "09:00"
  endTime: string;   // "18:00" or "06:00"
  gracePeriodMins: number; // 15
  halfDayHours: number;    // 4.5
  fullDayHours: number;    // 8.0
  breakDurationMins: number; // 45
  department: string;
}

export interface RosterItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftName: string;
  timing: string;
  dayOfWeek: string;
  date: string;
}

export interface HolidayItem {
  id: string;
  title: string;
  date: string;
  type: "National" | "Public" | "Optional Floating" | "Regional";
  branchLocation: string;
  mandatory: boolean;
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  missedPunchType: "Check-In" | "Check-Out" | "Both" | "Status Correction";
  requestedTime: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedAt: string;
  approverName?: string;
  approvedAt?: string;
  reviewComment?: string;
  originalPunchTime?: string;
  companyId?: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  projectName: string;
  taskDescription: string;
  loggedHours: number;
  billable: boolean;
  date: string;
  status: "Submitted" | "Approved" | "Rejected";
}

export interface OvertimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  standardHours: number;
  actualHours: number;
  overtimeHours: number;
  rateMultiplier: "1.5x (Weekday)" | "2.0x (Weekend/Holiday)";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface AttendanceState {
  punches: PunchRecord[];
  shifts: ShiftTemplate[];
  rosters: RosterItem[];
  holidays: HolidayItem[];
  regularizations: RegularizationRequest[];
  timesheets: TimesheetEntry[];
  overtimes: OvertimeEntry[];

  // Punches
  addPunch: (punch: Omit<PunchRecord, "id">) => { success: boolean; message?: string };
  deletePunch: (id: string) => void;

  // Shifts
  addShift: (shift: Omit<ShiftTemplate, "id">) => void;
  updateShift: (id: string, shift: Partial<ShiftTemplate>) => void;
  deleteShift: (id: string) => void;

  // Rosters
  addRoster: (roster: Omit<RosterItem, "id">) => void;
  deleteRoster: (id: string) => void;

  // Holidays
  addHoliday: (holiday: Omit<HolidayItem, "id">) => void;
  deleteHoliday: (id: string) => void;

  // Regularization
  addRegularization: (req: Omit<RegularizationRequest, "id" | "appliedAt">) => void;
  updateRegularizationStatus: (
    id: string,
    status: "Approved" | "Rejected",
    approverName?: string,
    comment?: string
  ) => void;

  // Timesheets
  addTimesheet: (ts: Omit<TimesheetEntry, "id">) => void;
  updateTimesheetStatus: (id: string, status: "Approved" | "Rejected") => void;

  // Overtime
  addOvertime: (ot: Omit<OvertimeEntry, "id">) => void;
  updateOvertimeStatus: (id: string, status: "Approved" | "Rejected") => void;
}

const STORAGE_KEYS = {
  PUNCHES: "ofc360_att_punches_v3",
  SHIFTS: "ofc360_att_shifts_v3",
  ROSTERS: "ofc360_att_rosters_v3",
  HOLIDAYS: "ofc360_att_holidays_v3",
  REGULARIZATIONS: "ofc360_att_reg_v3",
  TIMESHEETS: "ofc360_att_timesheets_v3",
  OVERTIMES: "ofc360_att_overtimes_v3",
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  punches: getStoredData<PunchRecord[]>(STORAGE_KEYS.PUNCHES, []),
  shifts: getStoredData<ShiftTemplate[]>(STORAGE_KEYS.SHIFTS, []),
  rosters: getStoredData<RosterItem[]>(STORAGE_KEYS.ROSTERS, []),
  holidays: getStoredData<HolidayItem[]>(STORAGE_KEYS.HOLIDAYS, []),
  regularizations: getStoredData<RegularizationRequest[]>(STORAGE_KEYS.REGULARIZATIONS, []),
  timesheets: getStoredData<TimesheetEntry[]>(STORAGE_KEYS.TIMESHEETS, []),
  overtimes: getStoredData<OvertimeEntry[]>(STORAGE_KEYS.OVERTIMES, []),


  // Punches
  addPunch: (punch) => {
    const existingPunches = get().punches;
    const todayStr = punch.date || new Date().toISOString().split("T")[0];

    // Safeguard duplicate punches
    if (punch.type === "Check-In") {
      const alreadyCheckedIn = existingPunches.some(
        (p) =>
          p.employeeId === punch.employeeId &&
          (p.date === todayStr || (!p.date && p.timestamp)) &&
          p.type === "Check-In" &&
          !existingPunches.some(
            (out) =>
              out.employeeId === punch.employeeId &&
              out.type === "Check-Out" &&
              out.date === todayStr
          )
      );
      if (alreadyCheckedIn) {
        return { success: false, message: "Active check-in already recorded today." };
      }
    }

    const newPunch: PunchRecord = {
      id: `PUN-${Date.now().toString().slice(-5)}`,
      date: todayStr,
      ...punch,
    };
    const updated = [newPunch, ...existingPunches];
    setStoredData(STORAGE_KEYS.PUNCHES, updated);
    set({ punches: updated });
    return { success: true };
  },

  deletePunch: (id) => {
    const updated = get().punches.filter((p) => p.id !== id);
    setStoredData(STORAGE_KEYS.PUNCHES, updated);
    set({ punches: updated });
  },

  // Shifts
  addShift: (shift) => {
    const newShift: ShiftTemplate = {
      id: `SHF-${Date.now().toString().slice(-4)}`,
      ...shift,
    };
    const updated = [...get().shifts, newShift];
    setStoredData(STORAGE_KEYS.SHIFTS, updated);
    set({ shifts: updated });
  },
  updateShift: (id, fields) => {
    const updated = get().shifts.map((s) => (s.id === id ? { ...s, ...fields } : s));
    setStoredData(STORAGE_KEYS.SHIFTS, updated);
    set({ shifts: updated });
  },
  deleteShift: (id) => {
    const updated = get().shifts.filter((s) => s.id !== id);
    setStoredData(STORAGE_KEYS.SHIFTS, updated);
    set({ shifts: updated });
  },

  // Rosters
  addRoster: (roster) => {
    const newRoster: RosterItem = {
      id: `ROS-${Date.now().toString().slice(-4)}`,
      ...roster,
    };
    const updated = [...get().rosters, newRoster];
    setStoredData(STORAGE_KEYS.ROSTERS, updated);
    set({ rosters: updated });
  },
  deleteRoster: (id) => {
    const updated = get().rosters.filter((r) => r.id !== id);
    setStoredData(STORAGE_KEYS.ROSTERS, updated);
    set({ rosters: updated });
  },

  // Holidays
  addHoliday: (holiday) => {
    const newHoliday: HolidayItem = {
      id: `HOL-${Date.now().toString().slice(-4)}`,
      ...holiday,
    };
    const updated = [...get().holidays, newHoliday];
    setStoredData(STORAGE_KEYS.HOLIDAYS, updated);
    set({ holidays: updated });
  },
  deleteHoliday: (id) => {
    const updated = get().holidays.filter((h) => h.id !== id);
    setStoredData(STORAGE_KEYS.HOLIDAYS, updated);
    set({ holidays: updated });
  },

  // Regularization with Automatic Punch Bi-Directional Synchronization
  addRegularization: (req) => {
    const newReq: RegularizationRequest = {
      id: `REG-${Date.now().toString().slice(-4)}`,
      appliedAt: new Date().toLocaleDateString(),
      ...req,
    };
    const updated = [newReq, ...get().regularizations];
    setStoredData(STORAGE_KEYS.REGULARIZATIONS, updated);
    set({ regularizations: updated });
  },

  updateRegularizationStatus: (id, status, approverName, comment) => {
    const target = get().regularizations.find((r) => r.id === id);
    if (!target) return;

    const nowStr = new Date().toLocaleDateString();
    const updatedReqs = get().regularizations.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            approverName: approverName || "Manager / HR Admin",
            approvedAt: nowStr,
            reviewComment: comment || (status === "Approved" ? "Approved by reviewer" : "Rejected by reviewer"),
          }
        : r
    );

    let updatedPunches = [...get().punches];

    // If approved, automatically insert/update the punch record with regularized status
    if (status === "Approved") {
      const punchType = target.missedPunchType === "Check-Out" ? "Check-Out" : "Check-In";
      const newPunch: PunchRecord = {
        id: `PUN-REG-${Date.now().toString().slice(-5)}`,
        employeeId: target.employeeId,
        employeeName: target.employeeName,
        department: target.department || "Human Resources",
        timestamp: target.requestedTime,
        date: target.date,
        type: punchType,
        method: "Selfie Camera",
        location: "Main HQ Office (Regularized by HR)",
        taskNotes: `Regularized Missed Punch: ${target.reason}`,
        status: "Regularized",
        regularized: true,
      };
      updatedPunches = [newPunch, ...updatedPunches];
      setStoredData(STORAGE_KEYS.PUNCHES, updatedPunches);
    }

    setStoredData(STORAGE_KEYS.REGULARIZATIONS, updatedReqs);
    set({ regularizations: updatedReqs, punches: updatedPunches });
  },

  // Timesheets
  addTimesheet: (ts) => {
    const newTs: TimesheetEntry = {
      id: `TS-${Date.now().toString().slice(-4)}`,
      ...ts,
    };
    const updated = [newTs, ...get().timesheets];
    setStoredData(STORAGE_KEYS.TIMESHEETS, updated);
    set({ timesheets: updated });
  },
  updateTimesheetStatus: (id, status) => {
    const updated = get().timesheets.map((t) => (t.id === id ? { ...t, status } : t));
    setStoredData(STORAGE_KEYS.TIMESHEETS, updated);
    set({ timesheets: updated });
  },

  // Overtime
  addOvertime: (ot) => {
    const newOt: OvertimeEntry = {
      id: `OT-${Date.now().toString().slice(-4)}`,
      ...ot,
    };
    const updated = [newOt, ...get().overtimes];
    setStoredData(STORAGE_KEYS.OVERTIMES, updated);
    set({ overtimes: updated });
  },
  updateOvertimeStatus: (id, status) => {
    const updated = get().overtimes.map((o) => (o.id === id ? { ...o, status } : o));
    setStoredData(STORAGE_KEYS.OVERTIMES, updated);
    set({ overtimes: updated });
  },
}));