import type { RootState } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { isValidToken, isPublicRequest, getStoredRefreshToken, getStoredAccessToken } from "../authStorage";
import { handleTokenRefreshMutex } from "./tokenRefreshMutex";

export async function handle401Error(result: any, rawBaseQuery: any, args: any, api: any, extraOptions: any) {
  const requestUrl = typeof args === "string" ? args : args.url || "";
  const isPublic = isPublicRequest(requestUrl, api.endpoint);
  const isRetry = Boolean((extraOptions as any)?.isRetry || (typeof args === "object" && (args as any)?._isRetry));
  const token = (api.getState() as RootState)?.auth?.token || getStoredAccessToken();
  const stateRefresh = (api.getState() as RootState)?.auth?.refreshToken;
  const refreshToken = isValidToken(stateRefresh) ? stateRefresh : getStoredRefreshToken();

  if (result.error && result.error.status === 401 && !isPublic && !isRetry) {
    if (
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/login") ||
      !isValidToken(refreshToken) ||
      (requestUrl.includes("/auth/me") && !isValidToken(token) && !isValidToken(refreshToken))
    ) {
      api.dispatch(logout());
      return result;
    }
    const refreshed = await handleTokenRefreshMutex(rawBaseQuery, api);
    if (refreshed) {
      const retryArgs = typeof args === "string" ? { url: args, _isRetry: true } : { ...args, _isRetry: true };
      return await rawBaseQuery(retryArgs, api, { ...extraOptions, isRetry: true });
    }
  }
  return result;
}
