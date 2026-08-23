export interface SuperAdminOrganization {
  id: string;
  name: string;
  domain?: string;
  tier?: "Starter" | "Professional" | "Enterprise" | "Growth" | string;
  plan?: "Starter" | "Professional" | "Enterprise" | "Growth" | string;
  status?: "Active" | "Suspended" | "Pending" | "Trial" | string;
  usersCount?: number;
  maxUsers?: number;
  employeeCount?: number;
  employee_count?: number;
  mrr?: number;
  createdAt?: string;
  primaryContactEmail?: string;
  region?: string;
  complianceScore?: number;
  storageUsedGb?: number;
  hrAdminName?: string;
  hrAdminEmail?: string;
  hr_admin?: { name?: string; email?: string };
  hr_admins?: Array<{ name?: string; email?: string }>;
  industry?: string;
  location?: string;
}

export interface CreateOrganizationPayload {
  name: string;
  domain?: string;
  tier?: string;
  plan?: string;
  status?: string;
  primaryContactEmail?: string;
  hrAdminName?: string;
  hrAdminEmail?: string;
  employeeCount?: number;
  mrr?: number;
  industry?: string;
  location?: string;
  maxUsers?: number;
}
export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload> & { id?: string; status?: string };

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Org Admin" | "Support" | "Auditor" | "employee" | "manager" | "hr_admin" | "executive" | string;
  organizationId?: string;
  organizationName?: string;
  status?: "Active" | "Suspended" | "Pending" | string;
  lastLogin?: string;
  createdAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  organizationId?: string;
}
export type UpdateUserPayload = Partial<CreateUserPayload> & { status?: string };