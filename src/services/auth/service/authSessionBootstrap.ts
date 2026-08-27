import type { AppDispatch, RootState } from "@/app/store";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { notifyTokenUpdated } from "../authInterceptor";
import { fetchMeEndpoint } from "./authMeStep";
import { fetchRefreshAndRetry } from "./authRefreshStep";
import { isValidToken, getStoredAccessToken, getStoredRefreshToken, getStoredUser } from "../authStorage";

export async function runAuthBootstrap(dispatch: AppDispatch, getState: () => RootState, rawBaseUrl: string): Promise<boolean> {
  try {
    const state = getState();
    const token = isValidToken(state.auth.token) ? state.auth.token.trim() : getStoredAccessToken();
    const refreshToken = isValidToken(state.auth.refreshToken) ? state.auth.refreshToken.trim() : getStoredRefreshToken();
    const storedUser = getStoredUser();

    // 1. If an access token exists, validate it via /api/v1/auth/me
    if (token) {
      const meResult = await fetchMeEndpoint(rawBaseUrl, token);
      if (meResult.success && meResult.user) {
        dispatch(
          setCredentials({
            user: meResult.user,
            token: token,
            refreshToken: refreshToken || undefined,
            companyId: meResult.user.companyId,
          })
        );
        return true;
      }
      // If network was unreachable (status 0) and we already have a persisted valid user/token, preserve session
      if (meResult.status === 0 && storedUser) {
        dispatch(
          setCredentials({
            user: storedUser,
            token: token,
            refreshToken: refreshToken || undefined,
            companyId: storedUser.companyId,
          })
        );
        return true;
      }
    }

    // 2. If access token was missing or expired (401), and a refresh token is present, attempt refresh
    if (refreshToken) {
      const refreshed = await fetchRefreshAndRetry(rawBaseUrl, refreshToken);
      if (refreshed) {
        dispatch(
          setCredentials({
            user: refreshed.user,
            token: refreshed.token,
            refreshToken: refreshed.refreshToken,
            companyId: refreshed.user.companyId,
          })
        );
        notifyTokenUpdated(refreshed.token);
        return true;
      }
    }

    // 3. If NO tokens in storage, attempt cookie session check via /api/v1/auth/me with credentials: "include"
    if (!token && !refreshToken) {
      const cookieMeResult = await fetchMeEndpoint(rawBaseUrl, null);
      if (cookieMeResult.success && cookieMeResult.user) {
        dispatch(
          setCredentials({
            user: cookieMeResult.user,
            token: undefined,
            refreshToken: undefined,
            companyId: cookieMeResult.user.companyId,
          })
        );
        return true;
      }
    }

    // 4. If neither succeeded, clear auth state cleanly
    dispatch(logout());
    return false;
  } catch {
    // Silently handle any initialization error without triggering toasts/unhandled errors
    dispatch(logout());
    return false;
  }
}

