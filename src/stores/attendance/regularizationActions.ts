export const regActions = (set: any, get: any) => ({
  addRegularization: (req: any) => set((s: any) => {
    const r = { id: `r_${Math.random()}`, ...req };
    return { regularizationRequests: [req, ...s.regularizationRequests], regularizations: [r, ...s.regularizations] };
  }),
  updateRegularizationStatus: (id: string, status: string, app: string, rem: string) => set((s: any) => {
    const list = s.regularizations.map((r: any) => r.id === id ? { ...r, status, approverName: app, remark: rem } : r);
    const req = list.find((x: any) => x.id === id);
    let punches = s.punches;
    if (status === "Approved" && req) {
      punches = [{ id: `p_${Math.random()}`, employeeId: req.employeeId, employeeName: req.employeeName, department: req.department, timestamp: req.requestedTime, date: req.date, type: req.missedPunchType, status: "Regularized", regularized: true }, ...s.punches];
    }
    return { regularizations: list, punches };
  }),
});
