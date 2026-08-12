import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SystemRole = "employee" | "manager" | "hr_admin" | "cxo" | "it_admin" | "super_admin";
export type Role = SystemRole | "admin"; // backward compatibility

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, role: SystemRole | "admin", name?: string) => void;
  logout: () => void;
  setRole: (role: SystemRole | "admin") => void;
}

const normalizeRole = (r: SystemRole | "admin"): SystemRole => {
  if (r === "admin") return "hr_admin";
  return r;
};

const generateUUID = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "usr_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
};

const fakeJwt = (payload: object) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.sig_${Math.random().toString(36).slice(2, 10)}`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (email, role, name) => {
        const displayName =
          name?.trim() ||
          email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        const mappedRole = normalizeRole(role);
        const user: AuthUser = {
          id: generateUUID(),
          name: displayName,
          email,
          role: mappedRole,
        };
        set({ user, token: fakeJwt({ sub: user.id, role: mappedRole }), isAuthenticated: true });
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setRole: (role) => {
        const u = get().user;
        const mappedRole = normalizeRole(role);
        if (!u) {
          set({
            user: {
              id: generateUUID(),
              name: "Alex Mercer",
              email: "alex.mercer@nexahr.com",
              role: mappedRole,
            },
            token: fakeJwt({ sub: "usr_01", role: mappedRole }),
            isAuthenticated: true,
          });
          return;
        }
        set({ user: { ...u, role: mappedRole }, token: fakeJwt({ sub: u.id, role: mappedRole }) });
      },
    }),
    { name: "aiinsight-auth" }
  )
);

export const roleLabels: Record<SystemRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr_admin: "HR / Admin",
  cxo: "Executive / CXO",
  it_admin: "IT / System Admin",
  super_admin: "Super Admin",
};

export const roleLabel = (r: SystemRole | "admin"): string => {
  const norm = normalizeRole(r);
  return roleLabels[norm] || "Employee";
};