import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentRole,
  selectCompanyId,
  selectSessionStatus,
  selectAuthInitializing,
} from "@/features/auth/authSelectors";
import { setRole as setRoleAction, setCredentials } from "@/features/auth/authSlice";
import { SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { useAuthLogout } from "./auth/useAuthLogout";

type SetCredentialsPayload = Parameters<typeof setCredentials>[0];

export function useAuth() {
  const dispatch = useAppDispatch();
  const logout = useAuthLogout();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectAuthInitializing);
  const currentRole = useAppSelector(selectCurrentRole);
  const companyId = useAppSelector(selectCompanyId);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const loading = isInitializing || sessionStatus === "loading";
  const role = normalizeRole(user?.role || currentRole) as SystemRole;

  const setRole = useCallback(
    (r: SystemRole | "admin") => dispatch(setRoleAction(r)),
    [dispatch]
  );

  const setCredentialsCallback = useCallback(
    (p: SetCredentialsPayload) => dispatch(setCredentials(p)),
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    loading,
    isLoading: loading,
    isInitializing,
    role,
    companyId,
    sessionStatus,
    logout,
    setRole,
    setCredentials: setCredentialsCallback,
  };
}