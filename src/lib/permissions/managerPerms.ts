import type { ActionCapability } from "./types";

export const MANAGER_PERMISSIONS: Record<string, ActionCapability[]> = {
  profile: ["view", "edit"],
  my_team: ["view"],
  departments: ["view"],
  attendance: ["view", "approve"],
  leave: ["view", "approve"],
  payroll: ["view", "approve"],
  performance: ["view", "create", "edit"],
  engagement: ["view"],
  documents: ["view"],
  helpdesk: ["view", "create"],
  connect: ["view", "create", "edit", "manage"],
};
