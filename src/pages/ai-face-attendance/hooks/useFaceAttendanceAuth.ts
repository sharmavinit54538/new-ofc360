import { useAuth } from "@/hooks/useAuth";
import { normalizeRole } from "@/features/auth/authTypes";

export function useFaceAttendanceAuth() {
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role || "employee");
  const isManagerOrAbove = currentRole === "manager" || currentRole === "hr_admin" || currentRole === "super_admin";
  const isHrOrAdmin = currentRole === "hr_admin" || currentRole === "super_admin";

  return { user, currentRole, isManagerOrAbove, isHrOrAdmin };
}
