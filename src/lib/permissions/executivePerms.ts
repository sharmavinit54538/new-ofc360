import type { ActionCapability } from "./types";

export const EXECUTIVE_PERMISSIONS: Record<string, ActionCapability[]> = {
  dashboard: ["view", "export"],
  people: ["view"],
  departments: ["view"],
  payroll: ["view", "export"],
  analytics: ["view", "export"],
  intelligence_hub: ["view"],
  talent_intelligence: ["view"],
  resource_intelligence: ["view"],
  employee_experience: ["view"],
  system_settings: ["view", "edit"],
  reports: ["view", "export"],
  culture: ["view"],
  compliance: ["view"],
  connect: ["view", "create", "manage"],
};
