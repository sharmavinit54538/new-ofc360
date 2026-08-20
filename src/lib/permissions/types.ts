import { SystemRole } from "@/features/auth/authTypes";
import type { SystemModule, ActionCapability } from "./moduleTypes";

export type { SystemModule, ActionCapability };

export interface PermissionDefinition {
  module: SystemModule;
  actions: ActionCapability[];
}

export interface RoleConfig {
  id: SystemRole;
  name: string;
  description: string;
  scopeLabel: string;
  allowedModules: SystemModule[];
  permissions: Record<string, ActionCapability[]>;
}
