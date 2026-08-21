import { normalizeRole } from "@/features/auth/authTypes";
import { normalizeEmploymentStatus } from "./managerNormalizers";

export function buildManagerUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};
  const fn = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  const ln = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (fn) payload.first_name = fn;
  if (ln) payload.last_name = ln;
  if (b.personal_email || b.personalEmail) payload.personal_email = (b.personal_email || b.personalEmail).trim();
  if (b.company_email || b.companyEmail) payload.company_email = (b.company_email || b.companyEmail).trim();
  if (b.phone || b.phoneNumber) payload.phone = (b.phone || b.phoneNumber).trim();
  if (b.department || b.department_name) payload.department = (b.department || b.department_name).trim();
  if (b.designation !== undefined) payload.designation = String(b.designation).trim();
  if (b.role || b.systemRole) payload.role = normalizeRole(b.role || b.systemRole);
  if (b.employment_status || b.status) payload.employment_status = normalizeEmploymentStatus(b.employment_status || b.status);
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  if (b.can_approve_leave !== undefined) payload.can_approve_leave = Boolean(b.can_approve_leave ?? b.canApproveLeave);
  if (b.can_approve_attendance !== undefined) payload.can_approve_attendance = Boolean(b.can_approve_attendance ?? b.canApproveAttendance);
  if (b.can_manage_employees !== undefined) payload.can_manage_employees = Boolean(b.can_manage_employees ?? b.canManageEmployees);
  return payload;
}
