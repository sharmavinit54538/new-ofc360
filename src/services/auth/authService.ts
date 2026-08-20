import type { AppDispatch, RootState } from "@/app/store";
import { setCredentials, logout, setInitializing, setSessionStatus } from "@/features/auth/authSlice";
import { AuthUser, normalizeRole } from "@/features/auth/authTypes";
import { isValidToken } from "./authStorage";
import { notifyTokenUpdated } from "./authInterceptor";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";

let hasInitialized = false;
let initPromise: Promise<boolean> | null = null;

export const authService = {
  /**
   * Resets initialization flag (useful for testing)
   */
  resetInitState() {
    hasInitialized = false;
    initPromise = null;
  },

  /**
   * Executes the controlled auth bootstrap sequence exactly ONCE on app startup.
   */
  async initializeAuthSession(dispatch: AppDispatch, getState: () => RootState): Promise<boolean> {
    if (hasInitialized) {
      return getState().auth.isAuthenticated;
    }

    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      try {
        const state = getState();
        const currentToken = state.auth.token;

        const fetchOptions: RequestInit = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(isValidToken(currentToken) ? { Authorization: `Bearer ${currentToken.trim()}` } : {}),
          },
          credentials: "include",
        };

        // Step 1: Call /api/v1/auth/me ONCE
        let meRes = await fetch(`${rawBaseUrl}/api/v1/auth/me`, fetchOptions);

        if (meRes.status === 200) {
          const json = await meRes.json();
          const rawUser: AuthUser = json.data || json;

          const computedName =
            rawUser.name?.trim() ||
            (rawUser as any).full_name?.trim() ||
            ((rawUser as any).first_name
              ? `${(rawUser as any).first_name} ${(rawUser as any).last_name || ""}`.trim()
              : "") ||
            (rawUser.email
              ? rawUser.email
                  .split("@")[0]
                  .replace(/[._-]+/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "User");

          const user: AuthUser = {
            ...rawUser,
            name: computedName,
            role: normalizeRole(rawUser.role),
            companyId: rawUser.companyId || (rawUser as any).company_id,
          };

          dispatch(
            setCredentials({
              user,
              token: currentToken || undefined,
              companyId: user.companyId,
            })
          );
          hasInitialized = true;
          return true;
        }

        // Step 2: If 401, attempt refresh ONCE
        if (meRes.status === 401) {
          const inMemoryRefreshToken = state.auth.refreshToken;
          const refreshRes = await fetch(`${rawBaseUrl}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refreshToken: (inMemoryRefreshToken || "").trim(),
              refresh_token: (inMemoryRefreshToken || "").trim(),
            }),
            credentials: "include",
          });

          if (refreshRes.status === 200) {
            const refreshJson = await refreshRes.json();
            const resData = refreshJson.data || refreshJson;
            const newToken = resData.access_token || resData.token;
            const newRefreshToken = resData.refresh_token || resData.refreshToken;

            if (isValidToken(newToken)) {
              // Retry /auth/me ONCE with new access token
              const retryMeRes = await fetch(`${rawBaseUrl}/api/v1/auth/me`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newToken.trim()}`,
                },
                credentials: "include",
              });

              if (retryMeRes.status === 200) {
                const retryJson = await retryMeRes.json();
                const rawUser: AuthUser = retryJson.data || retryJson;
                const user: AuthUser = {
                  ...rawUser,
                  role: normalizeRole(rawUser.role),
                  companyId: rawUser.companyId || (rawUser as any).company_id,
                };

                dispatch(
                  setCredentials({
                    user,
                    token: newToken.trim(),
                    refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : inMemoryRefreshToken || null,
                    companyId: user.companyId,
                  })
                );

                notifyTokenUpdated(newToken.trim());
                hasInitialized = true;
                return true;
              }
            }
          }

          // Step 3: Refresh failed -> clear auth -> logout
          dispatch(logout());
          hasInitialized = true;
          return false;
        }

        // Any other non-200/401 status (e.g. server error or network issue)
        dispatch(setInitializing(false));
        dispatch(setSessionStatus("unauthenticated"));
        hasInitialized = true;
        return false;
      } catch (err) {
        console.warn("[AUTH_BOOTSTRAP] Error during initial session restore:", err);
        dispatch(setInitializing(false));
        dispatch(setSessionStatus("unauthenticated"));
        hasInitialized = true;
        return false;
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },
};
