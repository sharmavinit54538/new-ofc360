import type { RoleConfig } from "./types";
import { HR_ADMIN_MODULES } from "./hrAdminModules";
import { HR_ADMIN_PERMS_PART1 } from "./hrAdminPermsPart1";
import { HR_ADMIN_PERMS_PART2 } from "./hrAdminPermsPart2";

export const HR_ADMIN_ROLE_CONFIG: RoleConfig = {
  id: "hr_admin",
  name: "HR / Admin",
  description: "Full HR operational authority for employee lifecycle, departments, payroll, and compliance.",
  scopeLabel: "Organization HR Scope",
  allowedModules: HR_ADMIN_MODULES,
  permissions: {
    ...HR_ADMIN_PERMS_PART1,
    ...HR_ADMIN_PERMS_PART2,
  },
};
