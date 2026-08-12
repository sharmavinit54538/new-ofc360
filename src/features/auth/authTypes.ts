export type SystemRole =
  | "employee"
  | "manager"
  | "hr_admin"
  | "cxo"
  | "it_admin"
  | "super_admin";

export type Role = SystemRole | "admin"; // backward compatibility

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  avatar?: string;
  companyId?: string;
  department?: string;
}

export type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  role: SystemRole;
  companyId: string | null;
  sessionStatus: SessionStatus;
}

export const roleLabels: Record<SystemRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr_admin: "HR / Admin",
  cxo: "Executive / CXO",
  it_admin: "IT / System Admin",
  super_admin: "Super Admin",
};

export const roleLabel = (r: SystemRole | "admin"): string => {
  const norm: SystemRole = r === "admin" ? "hr_admin" : r;
  return roleLabels[norm] || "Employee";
};

