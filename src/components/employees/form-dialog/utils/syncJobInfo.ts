import type { Employee } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";
import type { JobDetailsState } from "../types/jobDetailsTypes";
import type { JobMetaState } from "../types/jobMetaTypes";

export function syncJobAndMeta(emp: Employee | null, j: JobDetailsState, m: JobMetaState) {
  if (!emp) return;
  j.setDepartment(emp.department || "Engineering");
  j.setDesignation(emp.designation || "");
  j.setEmploymentType(emp.employmentType || "FULL_TIME");
  j.setJoiningDate(emp.joiningDate || emp.joinedAt || new Date().toISOString().split("T")[0]);
  j.setReportingManager(emp.reportingManager || emp.manager || "");
  j.setShift(emp.shift || "General");
  j.setTeam(emp.team || "");
  j.setBranchOffice(emp.branchOffice || "Mumbai HQ");
  j.setWorkLocation(emp.workLocation || "Onsite");
  m.setProbationPeriod(Number(emp.probationPeriod) || 3);
  m.setCapacity(Number(emp.capacity) || 100);
  m.setCostCenterId(emp.costCenterId || "CC-ENG-01");
  const rawRole = (emp as any).role || (emp as any).systemRole || (emp as any).backendRole || (emp as any).portalRole;
  m.setRole(normalizeRole(rawRole));
  m.setLeaveGroup(emp.leaveGroup || "Standard India Policy");
  m.setStatus(emp.status || "Active");
}
