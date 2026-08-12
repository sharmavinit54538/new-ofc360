import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentRole,
  selectCompanyId,
  selectSessionStatus,
} from "@/features/auth/authSelectors";
import { logout as logoutAction, setRole as setRoleAction, setCredentials } from "@/features/auth/authSlice";
import { baseApi } from "@/services/api/baseApi";
import { useCallback } from "react";
import { SystemRole } from "@/features/auth/authTypes";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentRole);
  const companyId = useAppSelector(selectCompanyId);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);

  const setRole = useCallback(
    (newRole: SystemRole | "admin") => {
      dispatch(setRoleAction(newRole));
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    role,
    companyId,
    sessionStatus,
    logout,
    setRole,
    setCredentials: (payload: Parameters<typeof setCredentials>[0]) => dispatch(setCredentials(payload)),
  };
}
