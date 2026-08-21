export const punchStoreActions = (set: any, get: any) => ({
  addPunch: (p: any) => {
    const s = get(), punches = s.punches || [];
    const exists = punches.some((x: any) => x.employeeId === p.employeeId && x.date === p.date && x.type === p.type);
    if (exists) return { success: false, message: "Punch already recorded for this day" };
    const punch = { id: `p_${Math.random()}`, ...p };
    set((state: any) => ({ punches: [punch, ...state.punches] }));
    return { success: true, punch };
  },
  deletePunch: (id: string) => set((s: any) => ({ punches: s.punches.filter((x: any) => x.id !== id) })),
});
