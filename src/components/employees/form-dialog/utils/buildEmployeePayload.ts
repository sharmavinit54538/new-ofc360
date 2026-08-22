import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { buildCompPayload } from "./buildCompPayload";
import { buildPersonalPayload } from "./buildPersonalPayload";
import { buildJobPayload } from "./buildJobPayload";

export function buildEmployeePayload(s: EmployeeFormState): Omit<Employee, "id"> {
  const { basic, contact, job, meta, comp, lists } = s;
  const fullName = `${basic.firstName.trim()} ${basic.lastName.trim()}`;
  return {
    name: fullName, firstName: basic.firstName.trim(), lastName: basic.lastName.trim(),
    email: contact.companyWorkEmail.trim() || contact.personalEmail.trim(),
    role: meta.role, designation: job.designation.trim(), department: job.department,
    systemRole: meta.role, portalRole: meta.role, status: meta.status,
    joinedAt: job.joiningDate, joiningDate: job.joiningDate,
    ...buildCompPayload(comp), ...buildPersonalPayload(basic, contact),
    ...buildJobPayload(job, meta), ...lists,
  };
}