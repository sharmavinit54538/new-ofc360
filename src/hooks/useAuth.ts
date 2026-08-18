import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentRole,
  selectCompanyId,
  selectSessionStatus,
} from "@/features/auth/authSelectors";
import { logout as logoutAction, setRole as setRoleAction, setCredentials } from "@/features/auth/authSlice";
import { resetPresenceState } from "@/features/connect/presenceSlice";
import { baseApi } from "@/services/api/baseApi";
import { useLogoutSessionMutation } from "@/services/api/authApi";
import { connectWebSocketService } from "@/services/connectWebSocketService";
import { useCallback } from "react";
import { SystemRole } from "@/features/auth/authTypes";

export function useAuth() {
  const dispatch = useAppDispatch();
  const [logoutSessionApi] = useLogoutSessionMutation();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentRole);
  const companyId = useAppSelector(selectCompanyId);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const logout = useCallback(async () => {
    console.log("[LOGOUT] User initiated logout. Disconnecting WebSocket and broadcasting offline presence...");
    connectWebSocketService.disconnect();
    dispatch(resetPresenceState());

    try {
      await Promise.race([
        logoutSessionApi().unwrap(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Logout timeout")), 4000)),
      ]);
    } catch {
      // Backend logout failed or is unreachable — proceed with local logout anyway.
    } finally {
      dispatch(logoutAction());
      dispatch(baseApi.util.resetApiState());
    }
  }, [dispatch, logoutSessionApi]);

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
