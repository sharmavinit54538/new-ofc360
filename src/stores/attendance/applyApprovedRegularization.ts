export function createRegularizedPunch(req: any) {
  return {
    id: `punch_reg_${req.id || Math.random()}`, employeeId: req.employeeId, employeeName: req.employeeName || "Employee",
    date: req.date, timestamp: req.requestedTime || req.timestamp || "09:10 AM",
    type: req.missedPunchType === "Check-Out" ? "Check-Out" : "Check-In",
    status: "Regularized", regularized: true, location: req.reason || "Regularized Punch",
  };
}
