import type { PunchRecord } from "./punchTypes";
import type { StoreSet, StoreGet } from "./storeTypes";

export const punchStoreActions = (set: StoreSet, get: StoreGet) => ({
  addPunch: (p: PunchRecord) => {
    const s = get(), punches = s.punches || [];
    const exists = punches.some((x) => x.employeeId === p.employeeId && x.date === p.date && x.type === p.type);
    if (exists) return { success: false, message: "Punch already recorded for this day" };
    const punch = { id: `p_${Math.random()}`, ...p };
    set((state) => ({ punches: [punch, ...state.punches] }));
    return { success: true, punch };
  },
  deletePunch: (id: string) => set((s) => ({ punches: s.punches.filter((x) => x.id !== id) })),
});
