import type { ActionCapability } from "./types";

export const HR_ADMIN_PERMS_PART1: Record<string, ActionCapability[]> = {
  dashboard: ["view"],
  people: ["view", "create", "edit", "delete", "export", "manage"],
  employees: ["view", "create", "edit", "delete", "export", "manage"],
  departments: ["view", "create", "edit", "delete", "manage"],
  attendance: ["view", "edit", "approve", "export"],
  leave: ["view", "create", "edit", "approve", "export"],
  payroll: ["view", "create", "edit", "approve", "export"],
  recruitment: ["view", "create", "edit", "manage"],
  hiring_planning: ["view", "create", "edit"],
  performance: ["view", "create", "edit", "manage"],
  training: ["view", "create", "edit"],
  engagement: ["view", "create"],
  culture: ["view"],
};
