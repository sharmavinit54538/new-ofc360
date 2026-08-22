import type { Employee } from "@/types/hr";
import type { JobDetailsState } from "../types/jobDetailsTypes";
import type { JobMetaState } from "../types/jobMetaTypes";
import { syncJobMeta } from "./syncJobMeta";

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
  syncJobMeta(emp, m);
}
