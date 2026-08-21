import type { RootState } from "@/app/store";
import { logout, setCredentials } from "@/features/auth/authSlice";
import { isValidToken } from "../authStorage";
import { notifyTokenUpdated } from "./tokenListeners";

let refreshPromise: Promise<boolean> | null = null;

export async function handleTokenRefreshMutex(rawBaseQuery: any, api: any): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  const inMemory = (api.getState() as RootState)?.auth?.refreshToken;
  refreshPromise = (async () => {
    try {
      const res = await rawBaseQuery({ url: "/api/v1/auth/refresh", method: "POST", body: { refreshToken: (inMemory || "").trim() } }, api, { isRetry: true });
      const d = res.data?.data || res.data;
      const tok = d?.access_token || d?.token;
      const refTok = d?.refresh_token || d?.refreshToken;
      if (isValidToken(tok)) {
        const u = (api.getState() as RootState)?.auth?.user;
        api.dispatch(setCredentials({ user: d?.user || u || { id: "u1", name: "User", email: "", role: "employee" }, token: tok.trim(), refreshToken: isValidToken(refTok) ? refTok.trim() : inMemory || null }));
        notifyTokenUpdated(tok.trim()); return true;
      }
      api.dispatch(logout()); return false;
    } catch { api.dispatch(logout()); return false; } finally { refreshPromise = null; }
  })();
  return refreshPromise;
}
