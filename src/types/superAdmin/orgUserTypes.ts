export interface SuperAdminOrganization {
  id: string; name: string; domain: string; tier: "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Suspended" | "Pending" | "Trial"; usersCount: number; maxUsers: number;
  mrr: number; createdAt: string; primaryContactEmail: string; region: string; complianceScore: number;
}
export interface CreateOrganizationPayload { name: string; domain: string; tier: string; primaryContactEmail: string; maxUsers: number; }
export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload> & { status?: string };
export interface SuperAdminUser {
  id: string; name: string; email: string; role: "Super Admin" | "Org Admin" | "Support" | "Auditor";
  organizationId?: string; organizationName?: string; status: "Active" | "Suspended" | "Pending"; lastLogin?: string; createdAt: string;
}
export interface CreateUserPayload { name: string; email: string; role: string; organizationId?: string; }
export type UpdateUserPayload = Partial<CreateUserPayload> & { status?: string };