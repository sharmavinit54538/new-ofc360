export function extractManagerCompAndPerms(b: any, payload: Record<string, any>) {
  if (b.branch || b.branchOffice) payload.branch = (b.branch || b.branchOffice).trim();
  if (b.work_location || b.workLocation) payload.work_location = (b.work_location || b.workLocation).trim();
  if (b.shift) payload.shift = String(b.shift).trim();
  const prob = b.probation_period_months ?? b.probationPeriod ?? b.probation_period;
  if (prob !== undefined && prob !== null) payload.probation_period_months = Number(prob);
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  else if (b.salary !== undefined && b.salary !== null) payload.ctc = Number(b.salary);
  const bs = b.basic_salary ?? b.basicSalary; if (bs !== undefined && bs !== null) payload.basic_salary = Number(bs);
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
  if (b.bonus !== undefined && b.bonus !== null) payload.bonus = Number(b.bonus);
  const pf = b.pf ?? b.pfDeduction ?? b.pf_deduction; if (pf !== undefined && pf !== null) payload.pf = Number(pf);
  const esi = b.esi ?? b.esiDeduction ?? b.esi_deduction; if (esi !== undefined && esi !== null) payload.esi = Number(esi);
  const pt = b.professional_tax ?? b.profTax ?? b.prof_tax; if (pt !== undefined && pt !== null) payload.professional_tax = Number(pt);
  const lg = b.leave_group ?? b.leaveGroup; if (lg) payload.leave_group = String(lg).trim();
  if (b.can_approve_leave !== undefined || b.canApproveLeave !== undefined) payload.can_approve_leave = Boolean(b.can_approve_leave ?? b.canApproveLeave);
  if (b.can_approve_attendance !== undefined || b.canApproveAttendance !== undefined) payload.can_approve_attendance = Boolean(b.can_approve_attendance ?? b.canApproveAttendance);
  if (b.can_manage_employees !== undefined || b.canManageEmployees !== undefined) payload.can_manage_employees = Boolean(b.can_manage_employees ?? b.canManageEmployees);
}
