import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { normalizeRole } from "@/features/auth/authTypes";
import type { AttendanceTabType } from "../../types/attendance.types";

export function useAttendanceRouteAndRole() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") || "overview") as AttendanceTabType;
  const setTab = (tab: string) => setSearchParams({ tab });
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || "employee");
  const isManagerOrAbove = userRole === "manager" || userRole === "hr_admin" || userRole === "super_admin";
  const isHrOrAdmin = userRole === "hr_admin" || userRole === "super_admin";
  return { activeTab, setTab, user, userRole, isHrOrAdmin, isManagerOrAbove };
}
