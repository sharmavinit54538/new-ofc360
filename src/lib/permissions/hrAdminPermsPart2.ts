import type { ActionCapability } from "./types";

export const HR_ADMIN_PERMS_PART2: Record<string, ActionCapability[]> = {
  compliance: ["view", "create", "edit", "manage"],
  documents: ["view", "create", "edit", "delete"],
  onboarding: ["view", "create", "edit"],
  exit: ["view", "create", "edit"],
  analytics: ["view", "export"],
  intelligence_hub: ["view", "manage"],
  talent_intelligence: ["view", "manage"],
  resource_intelligence: ["view", "manage"],
  employee_experience: ["view", "manage"],
  system_settings: ["view", "edit", "manage"],
  helpdesk: ["view", "create", "edit", "manage"],
  reports: ["view", "export"],
  connect: ["view", "create", "edit", "delete", "manage", "export"],
};
