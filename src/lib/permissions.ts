import { SystemRole } from "@/features/auth/authTypes";

export type SystemModule =
  | "dashboard"
  | "profile"
  | "my_team"
  | "employees"
  | "departments"
  | "attendance"
  | "leave"
  | "payroll"
  | "recruitment"
  | "hiring_planning"
  | "performance"
  | "training"
  | "engagement"
  | "culture"
  | "compliance"
  | "documents"
  | "onboarding"
  | "exit"
  | "analytics"
  | "intelligence_hub"
  | "rbac"
  | "system_settings"
  | "audit_logs"
  | "helpdesk"
  | "it_access"
  | "reports"
  | "talent_intelligence"
  | "resource_intelligence"
  | "people"
  | "employee_experience"
  | "connect"
  | "super_admin"
  | "platform_companies"
  | "platform_users"
  | "platform_subscriptions"
  | "platform_analytics"
  | "platform_system"
  | "platform_security";

export type ActionCapability =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "export"
  | "manage";

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

export const ROLE_CONFIGS: Record<SystemRole, RoleConfig> = {
  employee: {
    id: "employee",
    name: "Employee",
    description: "Self-service access to personal attendance punches, regularization, leave, payslips, documents, onboarding, and helpdesk support.",
    scopeLabel: "Employee Self-Service Portal",
    allowedModules: [
      "attendance",
      "leave",
      "payroll",
      "documents",
      "onboarding",
      "helpdesk",
      "connect",
    ],
    permissions: {
      attendance: ["view", "create"],
      leave: ["view", "create"],
      payroll: ["view"],
      documents: ["view"],
      onboarding: ["view", "edit"],
      helpdesk: ["view", "create"],
      connect: ["view", "create", "edit", "manage"],
    },
  },
  manager: {
    id: "manager",
    name: "Manager",
    description: "Team management scope for reviewing team goals, approving attendance regularization, approving leave, and evaluating team performance.",
    scopeLabel: "Team Scope",
    allowedModules: [
      "profile",
      "my_team",
      "attendance",
      "leave",
      "performance",
      "engagement",
      "documents",
      "helpdesk",
      "connect",
    ],
    permissions: {
      profile: ["view", "edit"],
      my_team: ["view"],
      attendance: ["view", "approve"],
      leave: ["view", "approve"],
      performance: ["view", "create", "edit"],
      engagement: ["view"],
      documents: ["view"],
      helpdesk: ["view", "create"],
      connect: ["view", "create", "edit", "manage"],
    },
  },
  hr_admin: {
    id: "hr_admin",
    name: "HR / Admin",
    description: "Full HR operational authority for employee lifecycle, departments, payroll, and compliance.",
    scopeLabel: "Organization HR Scope",
    allowedModules: [
      "dashboard",
      "people",
      "employees",
      "departments",
      "attendance",
      "leave",
      "payroll",
      "recruitment",
      "hiring_planning",
      "performance",
      "training",
      "engagement",
      "culture",
      "compliance",
      "documents",
      "onboarding",
      "exit",
      "analytics",
      "intelligence_hub",
      "talent_intelligence",
      "resource_intelligence",
      "employee_experience",
      "system_settings",
      "helpdesk",
      "reports",
      "connect",
    ],
    permissions: {
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
      compliance: ["view", "create", "edit", "manage"],
      documents: ["view", "create", "edit", "delete"],
      onboarding: ["view", "create", "edit"],
      exit: ["view", "create", "edit"],
      analytics: ["view", "export"],
      intelligence_hub: ["view"],
      talent_intelligence: ["view", "manage"],
      resource_intelligence: ["view", "manage"],
      employee_experience: ["view", "manage"],
      system_settings: ["view", "edit", "manage"],
      helpdesk: ["view", "create", "edit", "manage"],
      reports: ["view", "export"],
      connect: ["view", "create", "edit", "delete", "manage", "export"],
    },
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Strategic executive insight into workforce health, organizational analytics, and AI recommendations.",
    scopeLabel: "Executive Insights",
    allowedModules: [
      "dashboard",
      "people",
      "departments",
      "analytics",
      "intelligence_hub",
      "talent_intelligence",
      "resource_intelligence",
      "employee_experience",
      "system_settings",
      "reports",
      "culture",
      "compliance",
      "connect",
    ],
    permissions: {
      dashboard: ["view", "export"],
      people: ["view"],
      departments: ["view"],
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
    },
  },
  it_admin: {
    id: "it_admin",
    name: "IT / System Admin",
    description: "Technical system management, SSO, MFA, RBAC permission matrices, integrations, and audit logs.",
    scopeLabel: "System & Infrastructure",
    allowedModules: [
      "dashboard",
      "it_access",
      "resource_intelligence",
      "rbac",
      "system_settings",
      "audit_logs",
      "connect",
    ],
    permissions: {
      dashboard: ["view"],
      it_access: ["view", "create", "edit", "delete", "manage"],
      resource_intelligence: ["view", "manage"],
      rbac: ["view", "create", "edit", "delete", "manage"],
      system_settings: ["view", "edit", "manage"],
      audit_logs: ["view", "export"],
      connect: ["view", "create", "manage"],
    },
  },
  super_admin: {
    id: "super_admin",
    name: "Super Admin",
    description: "Ultimate platform administrator with global multi-tenant control, subscriptions, infrastructure health, and security governance.",
    scopeLabel: "Global Platform Administration",
    allowedModules: [
      "dashboard",
      "super_admin",
      "platform_companies",
      "platform_users",
      "platform_subscriptions",
      "platform_analytics",
      "platform_system",
      "platform_security",
      "people",
      "employees",
      "departments",
      "attendance",
      "leave",
      "payroll",
      "recruitment",
      "hiring_planning",
      "performance",
      "training",
      "engagement",
      "culture",
      "compliance",
      "documents",
      "onboarding",
      "exit",
      "analytics",
      "intelligence_hub",
      "talent_intelligence",
      "resource_intelligence",
      "employee_experience",
      "system_settings",
      "helpdesk",
      "reports",
      "it_access",
      "rbac",
      "audit_logs",
      "connect",
    ],
    permissions: {
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
      intelligence_hub: ["view"],
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
    },
  },
};

function getResolvedRoleConfig(role?: string): RoleConfig | undefined {
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

/**
 * Checks whether a given role can view/access a module.
 */
export function hasModuleAccess(role: SystemRole | string, module: SystemModule): boolean {
  const config = getResolvedRoleConfig(role);
  if (!config) return false;
  return config.allowedModules.includes(module);
}

/**
 * Checks whether a given role has permission to perform an action on a module.
 */
export function hasPermission(
  role: SystemRole | string,
  module: SystemModule,
  action: ActionCapability
): boolean {
  const config = getResolvedRoleConfig(role);
  if (!config) return false;
  if (!config.allowedModules.includes(module)) return false;
  const actions = config.permissions[module];
  if (!actions) return false;
  return actions.includes(action);
}

/**
 * Returns allowed permissions for a specific role and module.
 */
export function getModulePermissions(
  role: SystemRole | string,
  module: SystemModule
): ActionCapability[] {
  const config = getResolvedRoleConfig(role);
  if (!config || !config.permissions[module]) return [];
  return config.permissions[module];
}
