import type { RoleConfig } from "./types";
import { EXECUTIVE_PERMISSIONS } from "./executivePerms";

export const EXECUTIVE_ROLE_CONFIG: RoleConfig = {
  id: "executive",
  name: "Executive",
  description: "Strategic executive insight into workforce health, organizational analytics, and AI recommendations.",
  scopeLabel: "Executive Insights",
  allowedModules: ["dashboard", "people", "departments", "payroll", "analytics", "intelligence_hub", "talent_intelligence", "resource_intelligence", "employee_experience", "system_settings", "reports", "culture", "compliance", "connect"],
  permissions: EXECUTIVE_PERMISSIONS,
};
