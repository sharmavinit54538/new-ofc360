import { useAppSelector } from "@/app/hooks";
import {
  selectCurrentUser, selectIsAuthenticated, selectCurrentRole,
  selectCompanyId, selectSessionStatus, selectAuthInitializing,
} from "@/features/auth/authSelectors";
import { SystemRole, normalizeRole } from "@/features/auth/authTypes";

export function useAuthSelectors() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectAuthInitializing);
  const currentRole = useAppSelector(selectCurrentRole);
  const companyId = useAppSelector(selectCompanyId);
  const sessionStatus = useAppSelector(selectSessionStatus);
  const loading = isInitializing || sessionStatus === "loading";
  const role = normalizeRole(user?.role || currentRole) as SystemRole;
  return { user, isAuthenticated, isInitializing, currentRole, companyId, sessionStatus, loading, role };
}
