export type SystemModule =
  | "dashboard" | "profile" | "my_team" | "employees" | "departments"
  | "attendance" | "leave" | "payroll" | "recruitment" | "hiring_planning"
  | "performance" | "training" | "engagement" | "culture" | "compliance"
  | "documents" | "onboarding" | "exit" | "analytics" | "rbac"
  | "system_settings" | "audit_logs" | "helpdesk" | "it_access"
  | "reports" | "intelligence_hub" | "talent_intelligence"
  | "resource_intelligence" | "people" | "employee_experience"
  | "connect" | "super_admin" | "platform_companies" | "platform_users"
  | "platform_subscriptions" | "platform_analytics" | "platform_system"
  | "platform_security";

export type ActionCapability = "view" | "create" | "edit" | "delete" | "approve" | "export" | "manage";
