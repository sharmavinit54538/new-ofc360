import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@/app/store";
import { logout, setCredentials } from "@/features/auth/authSlice";
import { isPublicRequest, isValidToken, isValidUUID, needsCompanyId } from "./authStorage";

type TokenUpdateListener = (token: string) => void;
const tokenUpdateListeners = new Set<TokenUpdateListener>();

export const registerTokenUpdateListener = (listener: TokenUpdateListener) => {
  tokenUpdateListeners.add(listener);
  return () => {
    tokenUpdateListeners.delete(listener);
  };
};

export const notifyTokenUpdated = (newToken: string) => {
  tokenUpdateListeners.forEach((listener) => {
    try {
      listener(newToken);
    } catch {
      // ignore
    }
  });
};

// Mutex locking mechanism for concurrent 401 refresh requests
let refreshPromise: Promise<boolean> | null = null;

const waitFor = (fn: () => boolean, timeoutMs = 2000, intervalMs = 50): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (fn()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, intervalMs);
  });
};

const parseRetryAfter = (error: FetchBaseQueryError): number | null => {
  try {
    const meta = (error as any)?.meta;
    const response = meta?.response as Response | undefined;
    const retryAfterHeader = response?.headers?.get("retry-after");
    if (!retryAfterHeader) return null;

    const seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, 10000); // Capped at 10 seconds max
    }
    const targetTime = new Date(retryAfterHeader).getTime();
    if (!isNaN(targetTime)) {
      const diff = targetTime - Date.now();
      return diff > 0 ? Math.min(diff, 10000) : 1000;
    }
  } catch {
    // ignore
  }
  return null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createAuthBaseQueryWithReauth = (
  rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    const requestUrl = typeof args === "string" ? args : args.url || "";
    const isPublicAuthUrl = isPublicRequest(requestUrl, api.endpoint);
    const isRetry = Boolean((extraOptions as any)?.isRetry || (typeof args === "object" && (args as any)?._isRetry));

    const state = api.getState() as RootState;
    const token = state?.auth?.token;

    // Check Company ID requirement for authenticated domain routes
    if (isValidToken(token) && needsCompanyId(requestUrl, api.endpoint)) {
      let companyId =
        (api.getState() as RootState)?.auth?.companyId ||
        (api.getState() as RootState)?.company?.activeCompany?.id;

      if (!isValidUUID(companyId) && (api.getState() as RootState)?.auth?.isInitializing) {
        // Wait briefly for auth initialization to complete
        await waitFor(() => {
          const s = api.getState() as RootState;
          return !s.auth.isInitializing;
        }, 2000, 50);
      }

      const finalState = api.getState() as RootState;
      companyId =
        finalState?.auth?.companyId ||
        finalState?.company?.activeCompany?.id;

      if (!isValidUUID(companyId)) {
        return {
          error: {
            status: 400,
            statusText: "Bad Request",
            data: {
              message: "Request blocked: A valid Company ID (UUID) is required but was not found.",
            },
          } as FetchBaseQueryError,
        };
      }
    }

    // Execute initial request
    let result = await rawBaseQuery(args, api, extraOptions);

    // 1. Handle 429 Too Many Requests (Bounded rate-limit retry)
    if (result.error && result.error.status === 429 && !isRetry) {
      const waitTime = parseRetryAfter(result.error) || 1000;
      console.warn(`[API_429] Rate limited on ${requestUrl}. Backing off for ${waitTime}ms before 1-time retry...`);
      await delay(waitTime);

      const retryArgs = typeof args === "string" ? { url: args, _isRetry: true } : { ...args, _isRetry: true };
      result = await rawBaseQuery(retryArgs, api, { ...extraOptions, isRetry: true });
      return result;
    }

    // 2. Handle 401 Unauthorized with Single-Flight Refresh Mutex
    if (result.error && result.error.status === 401 && !isPublicAuthUrl && !isRetry) {
      // If the failed request is the refresh endpoint itself, or /auth/me on an unauthenticated session, logout without cascading resets
      if (requestUrl.includes("/auth/refresh") || (requestUrl.includes("/auth/me") && !isValidToken(token))) {
        api.dispatch(logout());
        return result;
      }

      const stateSnapshot = api.getState() as RootState;
      const inMemoryRefreshToken = stateSnapshot?.auth?.refreshToken;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshBody: Record<string, string> = {
              refreshToken: (inMemoryRefreshToken || "").trim(),
              refresh_token: (inMemoryRefreshToken || "").trim(),
            };

            const refreshResult = await rawBaseQuery(
              {
                url: "/api/v1/auth/refresh",
                method: "POST",
                body: refreshBody,
              },
              api,
              { isRetry: true }
            );

            if (refreshResult.data) {
              const raw = refreshResult.data as any;
              const resData = raw.data || raw;
              const newToken = resData.access_token || resData.token;
              const newRefreshToken = resData.refresh_token || resData.refreshToken;

              if (isValidToken(newToken)) {
                const currentUser = (api.getState() as RootState)?.auth?.user;
                api.dispatch(
                  setCredentials({
                    user: resData.user || currentUser || { id: "usr_me", name: "User", email: "", role: "employee" },
                    token: newToken.trim(),
                    refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : inMemoryRefreshToken || null,
                  })
                );

                // Notify token listeners (e.g. WebSocket) of refreshed token
                notifyTokenUpdated(newToken.trim());

                return true;
              }
            }

            // If refresh response didn't contain valid token, cleanly logout without resetApiState recursion
            api.dispatch(logout());
            return false;
          } catch {
            api.dispatch(logout());
            return false;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const refreshSuccess = await refreshPromise;

      if (refreshSuccess) {
        // Retry the original request exactly ONCE with new access token
        const retryArgs = typeof args === "string" ? { url: args, _isRetry: true } : { ...args, _isRetry: true };
        result = await rawBaseQuery(retryArgs, api, { ...extraOptions, isRetry: true });
      }
    }

    return result;
  };
};
