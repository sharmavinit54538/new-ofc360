import { useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { resetPresenceState } from "@/features/connect/presenceSlice";
import { api } from "@/api/client";
import { useLogoutSessionMutation } from "@/api/endpoints/auth";
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
    dispatch(api.util.resetApiState());
  }, [dispatch, logoutSessionApi]);
}
