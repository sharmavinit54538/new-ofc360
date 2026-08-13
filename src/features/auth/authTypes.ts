export type SystemRole =
  | "super_admin"
  | "hr_admin"
  | "manager"
  | "employee"
  | "executive"
  | "it_admin";

export type Role = SystemRole | "admin" | "cxo"; // backward compatibility

export const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "hr_admin", label: "HR Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "executive", label: "Executive" },
  { value: "it_admin", label: "IT Admin" },
] as const;

export type RoleOptionValue = (typeof ROLE_OPTIONS)[number]["value"];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  avatar?: string;
  companyId?: string;
  department?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
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
  super_admin: "Super Admin",
  hr_admin: "HR Admin",
  manager: "Manager",
  employee: "Employee",
  executive: "Executive",
  it_admin: "IT Admin",
};

export const normalizeRole = (role?: string | null): SystemRole => {
  if (!role) return "employee";
  const r = role.toLowerCase().trim();
  if (r === "super_admin" || r.includes("super")) return "super_admin";
  if (r === "hr_admin" || r === "admin" || r === "hr") return "hr_admin";
  if (r === "manager") return "manager";
  if (r === "it_admin" || r === "it") return "it_admin";
  if (
    r === "executive" ||
    r === "cxo" ||
    r === "ceo" ||
    r === "cfo" ||
    r === "cto" ||
    r === "coo" ||
    r === "cmo" ||
    r === "clo" ||
    r === "ciso" ||
    r === "cio" ||
    r.includes("exec")
  ) {
    return "executive";
  }
  return "employee";
};

export const roleLabel = (r?: string | null): string => {
  const norm: SystemRole = normalizeRole(r);
  return roleLabels[norm] || "Employee";
};



