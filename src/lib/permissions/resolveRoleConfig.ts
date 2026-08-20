import { SystemRole } from "@/features/auth/authTypes";
import type { RoleConfig } from "./types";
import { ROLE_CONFIGS } from "./roleConfigs";

export function getResolvedRoleConfig(role?: string): RoleConfig | undefined {
  if (!role) return undefined;
  const lower = role.toLowerCase().trim();
  if (lower === "admin") return ROLE_CONFIGS["hr_admin"];
  if (ROLE_CONFIGS[lower as SystemRole]) return ROLE_CONFIGS[lower as SystemRole];
  if (lower.includes("super")) return ROLE_CONFIGS["super_admin"];
  if (lower.includes("hr") || lower.includes("admin")) return ROLE_CONFIGS["hr_admin"];
  if (lower.includes("manager")) return ROLE_CONFIGS["manager"];
  if (lower.includes("cxo") || lower.includes("exec")) return ROLE_CONFIGS["executive"];
  return ROLE_CONFIGS["employee"];
}
