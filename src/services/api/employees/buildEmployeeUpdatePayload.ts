import { normalizeRole } from "@/features/auth/authTypes";

export function buildEmployeeUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};
  const firstName = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  const lastName = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (firstName) payload.first_name = firstName;
  if (lastName) payload.last_name = lastName;
  if (b.personal_email || b.personalEmail || b.email) payload.personal_email = (b.personal_email || b.personalEmail || b.email).trim();
  if (b.department || b.department_name) payload.department = (b.department || b.department_name).trim();
  if (b.designation) payload.designation = b.designation.trim();
  if (b.role || b.systemRole || b.backendRole) payload.role = normalizeRole(b.role || b.systemRole || b.backendRole);
  if (b.joining_date || b.joiningDate) payload.joining_date = String(b.joining_date || b.joiningDate).split("T")[0];
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  return payload;
}
