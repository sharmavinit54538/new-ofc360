import type { RoleConfig } from "./types";

export const EMPLOYEE_ROLE_CONFIG: RoleConfig = {
  id: "employee",
  name: "Employee",
  description: "Self-service access to personal attendance punches, regularization, leave, payslips, documents, onboarding, and helpdesk support.",
  scopeLabel: "Employee Self-Service Portal",
  allowedModules: ["departments", "attendance", "leave", "payroll", "documents", "onboarding", "helpdesk", "connect"],
  permissions: {
    departments: ["view"],
    attendance: ["view", "create"],
    leave: ["view", "create"],
    payroll: ["view"],
    documents: ["view"],
    onboarding: ["view", "edit"],
    helpdesk: ["view", "create"],
    connect: ["view", "create", "edit", "manage"],
  },
};
