import { useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { resetPresenceState } from "@/features/connect/presenceSlice";
import { baseApi } from "@/services/api/baseApi";
import { useLogoutSessionMutation } from "@/services/api/authApi";
import { connectWebSocketService } from "@/services/connectWebSocketService";

export function useAuthLogout() {
  const dispatch = useAppDispatch();
  const [logoutSessionApi] = useLogoutSessionMutation();
  return useCallback(async () => {
    connectWebSocketService.disconnect();
    dispatch(resetPresenceState());
    try { await Promise.race([logoutSessionApi().unwrap(), new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 4000))]); } catch {}
    dispatch(logoutAction());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch, logoutSessionApi]);
}
