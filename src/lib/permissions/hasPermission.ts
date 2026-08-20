import { SystemRole } from "@/features/auth/authTypes";
import type { SystemModule, ActionCapability } from "./types";
import { getResolvedRoleConfig } from "./resolveRoleConfig";

export function hasPermission(role: SystemRole | string, module: SystemModule, action: ActionCapability): boolean {
  const config = getResolvedRoleConfig(role);
  if (!config || !config.allowedModules.includes(module)) return false;
  const actions = config.permissions[module];
  return !!actions && actions.includes(action);
}

export function getModulePermissions(role: SystemRole | string, module: SystemModule): ActionCapability[] {
  const config = getResolvedRoleConfig(role);
  return config?.permissions[module] || [];
}
