import type { RoleConfig } from "./types";
import { MANAGER_PERMISSIONS } from "./managerPerms";

export const MANAGER_ROLE_CONFIG: RoleConfig = {
  id: "manager",
  name: "Manager",
  description: "Team management scope for reviewing team goals, approving attendance regularization, approving leave, and evaluating team performance.",
  scopeLabel: "Team Scope",
  allowedModules: ["profile", "my_team", "departments", "attendance", "leave", "payroll", "performance", "engagement", "documents", "helpdesk", "connect"],
  permissions: MANAGER_PERMISSIONS,
};
