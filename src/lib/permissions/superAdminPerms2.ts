import type { ActionCapability } from "./types";

export const SUPER_ADMIN_PERMS_PART2: Record<string, ActionCapability[]> = {
  recruitment: ["view", "create", "edit", "manage"],
  hiring_planning: ["view", "create", "edit"],
  performance: ["view", "create", "edit", "manage"],
  training: ["view", "create", "edit"],
  engagement: ["view", "create"],
  culture: ["view"],
  compliance: ["view", "create", "edit", "manage"],
  documents: ["view", "create", "edit", "delete"],
  onboarding: ["view", "create", "edit"],
  exit: ["view", "create", "edit"],
  analytics: ["view", "export"],
};
