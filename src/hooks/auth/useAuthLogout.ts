import { useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { resetPresenceState } from "@/features/connect/presenceSlice";
import { baseApi } from "@/services/api/baseApi";
import { useLogoutSessionMutation } from "@/services/api/authApi";
import { connectWebSocketService } from "@/services/connectWebSocketService";
import { executeLogoutRequest } from "./logoutHelper";

export function useAuthLogout() {
  const dispatch = useAppDispatch();
  const [logoutSessionApi] = useLogoutSessionMutation();
  return useCallback(async () => {
    connectWebSocketService.disconnect(true);
    dispatch(resetPresenceState());
    await executeLogoutRequest(logoutSessionApi);
    dispatch(logoutAction());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch, logoutSessionApi]);
}
