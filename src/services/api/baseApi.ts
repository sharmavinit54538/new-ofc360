import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./apiTags";
import { RootState } from "@/app/store";
import { logout, setCredentials } from "@/features/auth/authSlice";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";

const isValidToken = (token: unknown): token is string => {
  return (
    typeof token === "string" &&
    token.trim().length > 10 &&
    token !== "undefined" &&
    token !== "null" &&
    token !== "[object Object]"
  );
};

const isValidUUID = (id: unknown): id is string => {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
};

const PUBLIC_AUTH_ENDPOINTS = [
  "login",
  "register",
  "forgotPassword",
  "verifyResetOtp",
  "resetPassword",
  "verifyEmail",
  "resendOtp",
  "createAuthLogin",
  "createAuthRegister",
  "createAuthForgotPassword",
  "createAuthResetPassword",
  "createAuthVerifyEmail",
  "createAuthResendOtp",
];

const PUBLIC_AUTH_URL_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-reset-otp",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-otp",
];

const needsCompanyId = (url: string, endpoint?: string): boolean => {
  const isPublic = (endpoint && PUBLIC_AUTH_ENDPOINTS.includes(endpoint)) ||
    PUBLIC_AUTH_URL_PATTERNS.some((pattern) => url.includes(pattern));

  if (isPublic) return false;
  if (url.includes("/auth/me") || url.includes("/auth/refresh")) return false;

  return true;
};

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

export const baseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  timeout: 15000,
  fetchFn: async (input: RequestInfo | URL, init?: RequestInit) => {
    if (input instanceof Request) {
      return fetch(input);
    }
    return fetch(input, init);
  },
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token || localStorage.getItem("ofc360_access_token");
    const companyId = state?.auth?.companyId || state?.company?.activeCompany?.id || localStorage.getItem("ofc360_company_id");

    const isPublicEndpoint = endpoint ? PUBLIC_AUTH_ENDPOINTS.includes(endpoint) : false;

    if (isValidToken(token) && !isPublicEndpoint) {
      headers.set("Authorization", `Bearer ${token.trim()}`);
    }

    if (companyId && isValidUUID(companyId) && !isPublicEndpoint) {
      headers.set("X-Company-ID", companyId.trim());
    }

    return headers;
  },
});



// Mutex locking mechanism for concurrent 401 refresh requests
let refreshPromise: Promise<boolean> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestUrl = typeof args === "string" ? args : args.url || "";
  const isPublicAuthUrl = PUBLIC_AUTH_URL_PATTERNS.some((pattern) => requestUrl.includes(pattern));
  const isRetry = Boolean((extraOptions as any)?.isRetry || (typeof args === "object" && (args as any)?._isRetry));

  const state = api.getState() as RootState;
  const token = state?.auth?.token || localStorage.getItem("ofc360_access_token");

  if (isValidToken(token) && needsCompanyId(requestUrl, api.endpoint)) {
    let companyId = (api.getState() as RootState)?.auth?.companyId ||
                    (api.getState() as RootState)?.company?.activeCompany?.id ||
                    localStorage.getItem("ofc360_company_id");

    if (!isValidUUID(companyId) && (api.getState() as RootState)?.auth?.isInitializing) {
      // Wait for auth initialization to complete
      await waitFor(() => {
        const s = api.getState() as RootState;
        return !s.auth.isInitializing;
      }, 2000, 50);
    }

    // Re-check after potential wait
    const finalState = api.getState() as RootState;
    companyId = finalState?.auth?.companyId ||
                finalState?.company?.activeCompany?.id ||
                localStorage.getItem("ofc360_company_id");

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

  // Execute request
  let result = await baseQuery(args, api, extraOptions);

  // If 401 Unauthorized occurs on an authenticated endpoint and this is not already a retry
  if (result.error && result.error.status === 401 && !isPublicAuthUrl && !isRetry) {
    // If the failed endpoint was the refresh endpoint itself, immediately logout and stop
    if (requestUrl.includes("/auth/refresh")) {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      return result;
    }

    const state = api.getState() as RootState;
    const refreshToken = state?.auth?.refreshToken || localStorage.getItem("ofc360_refresh_token");

    if (!isValidToken(refreshToken)) {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      return result;
    }

    // Handle concurrent 401 calls with a single-flight mutex promise
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/api/v1/auth/refresh",
              method: "POST",
              body: {
                refreshToken: refreshToken.trim(),
                refresh_token: refreshToken.trim(),
              },
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
                  user: resData.user || currentUser,
                  token: newToken.trim(),
                  refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : refreshToken.trim(),
                })
              );
              return true;
            }
          }

          // If refresh returned without a valid token, cleanly log out
          api.dispatch(logout());
          api.dispatch(baseApi.util.resetApiState());
          return false;
        } catch {
          api.dispatch(logout());
          api.dispatch(baseApi.util.resetApiState());
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      // Retry the original request exactly ONCE with the new access token
      const retryArgs = typeof args === "string" ? { url: args, _isRetry: true } : { ...args, _isRetry: true };
      result = await baseQuery(retryArgs, api, { ...extraOptions, isRetry: true });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: API_TAGS,
  endpoints: () => ({}),
});

