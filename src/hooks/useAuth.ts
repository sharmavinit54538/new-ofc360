import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUser, selectIsAuthenticated, selectCurrentRole, selectCompanyId, selectSessionStatus, selectAuthInitializing } from "@/features/auth/authSelectors";
import { setRole as setRoleAction, setCredentials } from "@/features/auth/authSlice";
import { SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { useAuthLogout } from "./auth/useAuthLogout";

export function useAuth() {
  const dispatch = useAppDispatch();
  const logout = useAuthLogout();
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthInitializing) || useAppSelector(selectSessionStatus) === "loading";
  return {
    user, isAuthenticated: useAppSelector(selectIsAuthenticated), loading, isLoading: loading, isInitializing: useAppSelector(selectAuthInitializing),
    role: normalizeRole(user?.role || useAppSelector(selectCurrentRole)) as SystemRole, companyId: useAppSelector(selectCompanyId),
    sessionStatus: useAppSelector(selectSessionStatus), logout, setRole: (r: any) => dispatch(setRoleAction(r)), setCredentials: (p: any) => dispatch(setCredentials(p)),
  };
}