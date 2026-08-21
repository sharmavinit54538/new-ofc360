import type { AppDispatch, RootState } from "@/app/store";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { notifyTokenUpdated } from "../authInterceptor";
import { fetchMeEndpoint } from "./authMeStep";
import { fetchRefreshAndRetry } from "./authRefreshStep";
import { isValidToken, getStoredAccessToken, getStoredRefreshToken } from "../authStorage";

export async function runAuthBootstrap(dispatch: AppDispatch, getState: () => RootState, rawBaseUrl: string): Promise<boolean> {
  try {
    const state = getState();
    const token = isValidToken(state.auth.token) ? state.auth.token.trim() : getStoredAccessToken();
    const refreshToken = isValidToken(state.auth.refreshToken) ? state.auth.refreshToken.trim() : getStoredRefreshToken();

    // 1. Token Pre-Check:
    // If NO accessToken and NO refreshToken exists in state or storage,
    // immediately set auth state to unauthenticated and return early without making any network requests.
    if (!token && !refreshToken) {
      dispatch(logout());
      return false;
    }

    // 2. If an access token exists, validate it via /api/v1/auth/me
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
    }

    // 3. If access token was missing or expired (401), and a refresh token is present, attempt refresh
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

    // 4. If neither succeeded, clear auth state cleanly
    dispatch(logout());
    return false;
  } catch {
    // Silently handle any initialization error without triggering toasts/unhandled errors
    dispatch(logout());
    return false;
  }
}
