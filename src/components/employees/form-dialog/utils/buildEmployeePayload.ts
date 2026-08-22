import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { buildCompPayload } from "./buildCompPayload";

export function buildEmployeePayload(s: EmployeeFormState): Omit<Employee, "id"> {
  const { basic, contact, job, meta, comp, lists } = s;
  const fullName = `${basic.firstName.trim()} ${basic.lastName.trim()}`;
  return {
    name: fullName, firstName: basic.firstName.trim(), lastName: basic.lastName.trim(),
    email: contact.companyWorkEmail.trim() || contact.personalEmail.trim(),
    role: meta.role, designation: job.designation.trim(), department: job.department,
    systemRole: meta.role, portalRole: meta.role, status: meta.status,
    joinedAt: job.joiningDate, joiningDate: job.joiningDate,
    ...buildCompPayload(comp),
    phone: contact.phone.trim(), alternatePhone: contact.alternatePhone.trim(),
    personalEmail: contact.personalEmail.trim(), companyWorkEmail: contact.companyWorkEmail.trim(),
    gender: basic.gender, dob: basic.dob, bloodGroup: basic.bloodGroup, maritalStatus: basic.maritalStatus, photoUrl: basic.photoUrl,
    employmentType: job.employmentType, reportingManager: job.reportingManager, shift: job.shift, team: job.team,
    branchOffice: job.branchOffice, workLocation: job.workLocation, probationPeriod: meta.probationPeriod, capacity: meta.capacity,
    costCenterId: meta.costCenterId, leaveGroup: meta.leaveGroup, ...lists,
  };
}