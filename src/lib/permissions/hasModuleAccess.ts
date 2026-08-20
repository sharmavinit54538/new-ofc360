import { SystemRole } from "@/features/auth/authTypes";
import type { SystemModule } from "./types";
import { getResolvedRoleConfig } from "./resolveRoleConfig";

export function hasModuleAccess(role: SystemRole | string, module: SystemModule): boolean {
  const config = getResolvedRoleConfig(role);
  return !!config && config.allowedModules.includes(module);
}
