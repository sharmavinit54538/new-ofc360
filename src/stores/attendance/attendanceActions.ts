import { regActions } from "./regularizationActions";

export const createAttendanceActions = (set: any, get: any) => ({
  addPunch: (p: any) => {
    const s = get(), punches = s.punches || [];
    const exists = punches.some((x: any) => x.employeeId === p.employeeId && x.date === p.date && x.type === p.type);
    if (exists) return { success: false, message: "Punch already recorded for this day" };
    const punch = { id: `p_${Math.random()}`, ...p };
    set((s: any) => ({ punches: [punch, ...s.punches] }));
    return { success: true, punch };
  },
  deletePunch: (id: string) => set((s: any) => ({ punches: s.punches.filter((x: any) => x.id !== id) })),
  addShift: (st: any) => set((s: any) => ({ shifts: [...s.shifts, st] })),
  deleteShift: (id: string) => set((s: any) => ({ shifts: s.shifts.filter((x: any) => x.id !== id) })),
  addRoster: (r: any) => set((s: any) => ({ rosters: [...s.rosters, r] })),
  deleteRoster: (id: string) => set((s: any) => ({ rosters: s.rosters.filter((x: any) => x.id !== id) })),
  addHoliday: (h: any) => set((s: any) => ({ holidays: [...s.holidays, h] })),
  deleteHoliday: (id: string) => set((s: any) => ({ holidays: s.holidays.filter((x: any) => x.id !== id) })),
  addTimesheet: (t: any) => set((s: any) => ({ timesheets: [...s.timesheets, t] })),
  updateTimesheetStatus: (id: string, status: string) => set((s: any) => ({ timesheets: s.timesheets.map((x: any) => x.id === id ? { ...x, status } : x) })),
  addOvertime: (o: any) => set((s: any) => ({ overtimes: [...s.overtimes, o] })),
  updateOvertimeStatus: (id: string, status: string) => set((s: any) => ({ overtimes: s.overtimes.map((x: any) => x.id === id ? { ...x, status } : x) })),
  ...regActions(set, get),
});