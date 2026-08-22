import type { Employee } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";
import type { JobMetaState } from "../types/jobMetaTypes";

export function syncJobMeta(emp: Employee | null, m: JobMetaState) {
  if (!emp) return;
  m.setProbationPeriod(Number(emp.probationPeriod) || 3);
  m.setCapacity(Number(emp.capacity) || 100);
  m.setCostCenterId(emp.costCenterId || "CC-ENG-01");
  const rawRole = (emp as any).role || (emp as any).systemRole || (emp as any).backendRole || (emp as any).portalRole;
  m.setRole(normalizeRole(rawRole));
  m.setLeaveGroup(emp.leaveGroup || "Standard India Policy");
  m.setStatus(emp.status || "Active");
}
