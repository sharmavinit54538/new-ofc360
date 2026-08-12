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

const baseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state.auth.token || localStorage.getItem("ofc360_access_token");
    const companyId = state.auth.companyId || state.company?.activeCompany?.id;

    const publicEndpoints = ["login", "register", "forgotPassword", "verifyResetOtp", "resetPassword", "verifyEmail", "resendOtp"];
    const isPublicAuthEndpoint = publicEndpoints.includes(endpoint || "");

    if (token && !isPublicAuthEndpoint) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (companyId && !isPublicAuthEndpoint) {
      headers.set("X-Company-ID", companyId);
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
  // Execute initial request
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken || localStorage.getItem("ofc360_refresh_token");

    // Do not attempt refresh on auth endpoints (login/refresh) to prevent infinite loops
    const requestUrl = typeof args === "string" ? args : args.url;
    if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh")) {
      return result;
    }

    if (!refreshToken) {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      return result;
    }

    // Handle concurrent refresh calls with a single mutex promise
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/api/v1/auth/refresh",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as {
              token: string;
              refreshToken?: string;
              user?: any;
            };
            const currentUser = (api.getState() as RootState).auth.user;
            if (currentUser && data.token) {
              api.dispatch(
                setCredentials({
                  user: data.user || currentUser,
                  token: data.token,
                  refreshToken: data.refreshToken || refreshToken,
                })
              );
            }
            return true;
          } else {
            api.dispatch(logout());
            api.dispatch(baseApi.util.resetApiState());
            return false;
          }
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
      // Retry the original request ONCE with new access token
      result = await baseQuery(args, api, extraOptions);
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
