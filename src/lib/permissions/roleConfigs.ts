import { SystemRole } from "@/features/auth/authTypes";
import type { RoleConfig } from "./types";
import { EMPLOYEE_ROLE_CONFIG } from "./employeeConfig";
import { MANAGER_ROLE_CONFIG } from "./managerConfig";
import { HR_ADMIN_ROLE_CONFIG } from "./hrAdminConfig";
import { EXECUTIVE_ROLE_CONFIG } from "./executiveConfig";
import { IT_ADMIN_ROLE_CONFIG } from "./itAdminConfig";
import { SUPER_ADMIN_ROLE_CONFIG } from "./superAdminConfig";

export const ROLE_CONFIGS: Record<SystemRole, RoleConfig> = {
  employee: EMPLOYEE_ROLE_CONFIG,
  manager: MANAGER_ROLE_CONFIG,
  hr_admin: HR_ADMIN_ROLE_CONFIG,
  executive: EXECUTIVE_ROLE_CONFIG,
  it_admin: IT_ADMIN_ROLE_CONFIG,
  super_admin: SUPER_ADMIN_ROLE_CONFIG,
};
