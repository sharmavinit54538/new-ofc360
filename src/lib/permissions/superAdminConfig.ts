import type { RoleConfig } from "./types";
import { SUPER_ADMIN_MODULES } from "./superAdminModules";
import { SUPER_ADMIN_PERMS_PART1 } from "./superAdminPerms1";
import { SUPER_ADMIN_PERMS_PART2 } from "./superAdminPerms2";
import { SUPER_ADMIN_PERMS_PART3 } from "./superAdminPerms3";

export const SUPER_ADMIN_ROLE_CONFIG: RoleConfig = {
  id: "super_admin",
  name: "Super Admin",
  description: "Ultimate platform administrator with global multi-tenant control, subscriptions, infrastructure health, and security governance.",
  scopeLabel: "Global Platform Administration",
  allowedModules: SUPER_ADMIN_MODULES,
  permissions: {
    ...SUPER_ADMIN_PERMS_PART1,
    ...SUPER_ADMIN_PERMS_PART2,
    ...SUPER_ADMIN_PERMS_PART3,
  },
};
