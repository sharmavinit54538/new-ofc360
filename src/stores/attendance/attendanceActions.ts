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