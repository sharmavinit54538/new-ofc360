import { AuthUser, normalizeRole } from "@/features/auth/authTypes";

export function formatAuthUser(rawUser: AuthUser): AuthUser {
  const computedName =
    rawUser.name?.trim() || (rawUser as any).full_name?.trim() ||
    ((rawUser as any).first_name ? `${(rawUser as any).first_name} ${(rawUser as any).last_name || ""}`.trim() : "") ||
    (rawUser.email ? rawUser.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");
  return {
    ...rawUser,
    name: computedName,
    role: normalizeRole(rawUser.role),
    companyId: rawUser.companyId || (rawUser as any).company_id,
  };
}
