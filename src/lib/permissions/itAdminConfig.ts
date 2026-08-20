import type { RoleConfig } from "./types";

export const IT_ADMIN_ROLE_CONFIG: RoleConfig = {
  id: "it_admin",
  name: "IT / System Admin",
  description: "Technical system management, SSO, MFA, RBAC permission matrices, integrations, and audit logs.",
  scopeLabel: "System & Infrastructure",
  allowedModules: ["dashboard", "it_access", "resource_intelligence", "rbac", "system_settings", "audit_logs", "connect"],
  permissions: {
    dashboard: ["view"],
    it_access: ["view", "create", "edit", "delete", "manage"],
    resource_intelligence: ["view", "manage"],
    rbac: ["view", "create", "edit", "delete", "manage"],
    system_settings: ["view", "edit", "manage"],
    audit_logs: ["view", "export"],
    connect: ["view", "create", "manage"],
  },
};
