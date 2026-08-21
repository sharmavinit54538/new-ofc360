import { Department } from "@/types/hr";
import { getDepartmentFallbackLeads } from "./departmentLeadFallback";

export function normalizeDepartment(dept: any): Department {
  if (!dept || typeof dept !== "object") return dept;
  const id = String(dept.id ?? dept.department_id ?? dept._id ?? dept.departmentId ?? dept.dept_id ?? "");
  const name = dept.department_name || dept.departmentName || dept.name || dept.title || "";
  const code = dept.department_code || dept.departmentCode || dept.code || (name ? name.slice(0, 4).toUpperCase() : "DEP");
  let head = dept.head || dept.headOfDepartment || dept.head_of_department || dept.department_head || dept.departmentHead || dept.dept_head || dept.head_name || dept.manager_name || dept.managerName || dept.leader || dept.lead || "";
  let manager = dept.manager || dept.reportingManager || dept.reporting_manager || dept.reporting_manager_name || dept.reportingManagerName || dept.senior_manager || "";
  if (!head && manager) head = manager; else if (!manager && head) manager = head;
  if (!head && !manager && name) { const fallback = getDepartmentFallbackLeads(name); head = fallback.head; manager = fallback.manager; }
  const managerId = dept.manager_id || dept.managerId || dept.reporting_manager_id || dept.head_id || dept.department_head_id || "";
  const capacity = dept.employee_capacity !== undefined ? Number(dept.employee_capacity) : (dept.capacity !== undefined ? Number(dept.capacity) : 25);
  const employeeCount = dept.employee_count !== undefined ? Number(dept.employee_count) : (dept.employeeCount !== undefined ? Number(dept.employeeCount) : 10);
  const status = typeof dept.status === "string" ? (dept.status.toUpperCase() === "ACTIVE" ? "Active" : dept.status.toUpperCase() === "INACTIVE" ? "Inactive" : dept.status) : "Active";
  const hiringStatus = dept.hiring_status || dept.hiringStatus || "Open";
  const rawOpen = dept.openPositions ?? dept.open_positions ?? dept.openHiringPositions ?? dept.open_requisitions ?? dept.open_positions_count;
  const openPositions = rawOpen !== undefined && rawOpen !== null ? Number(rawOpen) : Math.max(0, capacity - employeeCount);
  return { ...dept, id, _id: id, name, code, head, manager, managerId, location: dept.location || "Headquarters", employeeCount, capacity, openPositions, budget: String(dept.budget ?? "0"), costCenter: dept.cost_center || dept.costCenter || "", status, hiringStatus, parentDepartment: dept.parent_department_name || dept.parentDepartment || "", extension: dept.extension_number || dept.extension || "", color: dept.color || "#0d9488", icon: dept.icon || "", description: dept.description || "", notes: dept.notes || "", createdAt: dept.created_at || dept.createdAt || new Date().toISOString(), updatedAt: dept.updated_at || dept.updatedAt || new Date().toISOString() };
}
