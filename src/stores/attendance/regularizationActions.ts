import type { RegularizationRequest } from "./regularizationTypes";
import type { StoreSet, StoreGet } from "./storeTypes";

export const regActions = (set: StoreSet, get: StoreGet) => ({
  addRegularization: (r: RegularizationRequest) => {
    const s = get(), reqs = s.regularizations || [];
    const exists = reqs.some((x) => x.employeeId === r.employeeId && x.date === r.date && x.missedPunchType === r.missedPunchType);
    if (exists) return { success: false, message: "Request already pending for this date & swipe" };
    const req = { id: `reg_${Math.random()}`, appliedAt: new Date().toISOString(), ...r };
    set((state) => ({ regularizations: [req, ...state.regularizations] }));
    return { success: true, request: req };
  },
  updateRegularizationStatus: (id: string, status: string, approverName?: string, reviewComment?: string) =>
    set((s) => ({ regularizations: s.regularizations.map((x) => x.id === id ? { ...x, status, approverName, reviewComment } : x) })),
  deleteRegularization: (id: string) => set((s) => ({ regularizations: s.regularizations.filter((x) => x.id !== id) })),
});
