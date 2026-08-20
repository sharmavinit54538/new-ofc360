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