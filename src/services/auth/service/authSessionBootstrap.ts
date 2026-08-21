import type { AppDispatch, RootState } from "@/app/store";
import { setCredentials, logout, setInitializing, setSessionStatus } from "@/features/auth/authSlice";
import { notifyTokenUpdated } from "../authInterceptor";
import { fetchMeEndpoint } from "./authMeStep";
import { fetchRefreshAndRetry } from "./authRefreshStep";

export async function runAuthBootstrap(dispatch: AppDispatch, getState: () => RootState, rawBaseUrl: string): Promise<boolean> {
  try {
    const state = getState();
    const meResult = await fetchMeEndpoint(rawBaseUrl, state.auth.token);
    if (meResult.success && meResult.user) {
      dispatch(setCredentials({ user: meResult.user, token: state.auth.token || undefined, companyId: meResult.user.companyId }));
      return true;
    }
    if (meResult.status === 401) {
      const refreshed = await fetchRefreshAndRetry(rawBaseUrl, state.auth.refreshToken);
      if (refreshed) {
        dispatch(setCredentials({ user: refreshed.user, token: refreshed.token, refreshToken: refreshed.refreshToken, companyId: refreshed.user.companyId }));
        notifyTokenUpdated(refreshed.token);
        return true;
      }
      dispatch(logout()); return false;
    }
    dispatch(setInitializing(false)); dispatch(setSessionStatus("unauthenticated")); return false;
  } catch (err) {
    console.warn("[AUTH_BOOTSTRAP] Error during initial session restore:", err);
    dispatch(setInitializing(false)); dispatch(setSessionStatus("unauthenticated")); return false;
  }
}
