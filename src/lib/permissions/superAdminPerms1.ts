import type { ActionCapability } from "./types";

export const SUPER_ADMIN_PERMS_PART1: Record<string, ActionCapability[]> = {
  dashboard: ["view", "export"],
  super_admin: ["view", "create", "edit", "delete", "approve", "export", "manage"],
  platform_companies: ["view", "create", "edit", "delete", "manage", "export"],
  platform_users: ["view", "create", "edit", "delete", "manage", "export"],
  platform_subscriptions: ["view", "create", "edit", "delete", "manage", "export"],
  platform_analytics: ["view", "export"],
  platform_system: ["view", "edit", "manage", "export"],
  platform_security: ["view", "edit", "manage", "export"],
  people: ["view", "create", "edit", "delete", "export", "manage"],
  employees: ["view", "create", "edit", "delete", "export", "manage"],
  departments: ["view", "create", "edit", "delete", "manage"],
  attendance: ["view", "edit", "approve", "export"],
  leave: ["view", "create", "edit", "approve", "export"],
  payroll: ["view", "create", "edit", "approve", "export"],
};
