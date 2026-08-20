import type { ActionCapability } from "./types";

export const SUPER_ADMIN_PERMS_PART3: Record<string, ActionCapability[]> = {
  intelligence_hub: ["view", "manage"],
  talent_intelligence: ["view", "manage"],
  resource_intelligence: ["view", "manage"],
  employee_experience: ["view", "manage"],
  system_settings: ["view", "edit", "manage"],
  helpdesk: ["view", "create", "edit", "manage"],
  reports: ["view", "export"],
  it_access: ["view", "create", "edit", "delete", "manage"],
  rbac: ["view", "create", "edit", "delete", "manage"],
  audit_logs: ["view", "export"],
  connect: ["view", "create", "edit", "delete", "manage", "export"],
};
