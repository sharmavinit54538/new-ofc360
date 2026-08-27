import { normalizeRole } from "@/features/auth/authTypes";

export function buildEmployeeUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};
  const firstName = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  const lastName = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (firstName) payload.first_name = firstName;
  if (lastName) payload.last_name = lastName;
  if (b.personal_email || b.personalEmail || b.email) payload.personal_email = (b.personal_email || b.personalEmail || b.email).trim();
  if (b.company_email || b.companyWorkEmail || b.work_email) payload.company_email = (b.company_email || b.companyWorkEmail || b.work_email).trim();
  if (b.phone || b.phone_number || b.phoneNumber) payload.phone = (b.phone || b.phone_number || b.phoneNumber).trim();
  if (b.department || b.department_name) payload.department = (b.department || b.department_name).trim();
  if (b.department_id || b.departmentId) payload.department_id = (b.department_id || b.departmentId).trim();
  if (b.designation) payload.designation = b.designation.trim();
  if (b.role || b.systemRole || b.backendRole) payload.role = normalizeRole(b.role || b.systemRole || b.backendRole);
  if (b.manager_id || b.managerId) payload.manager_id = (b.manager_id || b.managerId).trim();
  if (b.reporting_manager || b.reportingManager || b.manager_name || b.managerName) {
    payload.reporting_manager = (b.reporting_manager || b.reportingManager || b.manager_name || b.managerName).trim();
  }
  if (b.status || b.employment_status) payload.status = (b.status || b.employment_status).trim();
  if (b.joining_date || b.joiningDate) payload.joining_date = String(b.joining_date || b.joiningDate).split("T")[0];
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  else if (b.salary !== undefined && b.salary !== null) payload.ctc = Number(b.salary);
  return payload;
}

