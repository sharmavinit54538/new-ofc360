import type { ShiftTemplate, RosterItem, HolidayItem, TimesheetEntry, OvertimeEntry } from "./shiftHolidayTypes";
import type { StoreSet } from "./storeTypes";

export const shiftStoreActions = (set: StoreSet) => ({
  addShift: (st: ShiftTemplate) => set((s) => ({ shifts: [...s.shifts, st] })),
  deleteShift: (id: string) => set((s) => ({ shifts: s.shifts.filter((x) => x.id !== id) })),
  addRoster: (r: RosterItem) => set((s) => ({ rosters: [...s.rosters, r] })),
  deleteRoster: (id: string) => set((s) => ({ rosters: s.rosters.filter((x) => x.id !== id) })),
  addHoliday: (h: HolidayItem) => set((s) => ({ holidays: [...s.holidays, h] })),
  deleteHoliday: (id: string) => set((s) => ({ holidays: s.holidays.filter((x) => x.id !== id) })),
  addTimesheet: (t: TimesheetEntry) => set((s) => ({ timesheets: [...s.timesheets, t] })),
  updateTimesheetStatus: (id: string, status: string) => set((s) => ({ timesheets: s.timesheets.map((x) => x.id === id ? { ...x, status } : x) })),
  addOvertime: (o: OvertimeEntry) => set((s) => ({ overtimes: [...s.overtimes, o] })),
  updateOvertimeStatus: (id: string, status: string) => set((s) => ({ overtimes: s.overtimes.map((x) => x.id === id ? { ...x, status } : x) })),
});
