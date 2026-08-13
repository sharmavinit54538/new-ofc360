import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "@/features/auth/authSlice";

export const API_TAGS = [
  "User",
  "Employee",
  "Manager",
  "Department",
  "Attendance",
  "Leave",
  "Payroll",
  "PayrollCycle",
  "Payslip",
  "Candidate",
  "Application",
  "Job",
  "Interview",
  "Document",
  "Performance",
  "Goal",
  "Review",
  "Analytics",
  "AI",
  "Notification",
  "Calendar",
  "Event",
  "Exit",
  "Asset",
  "Settings",
  "Report",
  "Workflow",
  "Timesheet",
  "Travel",
  "EmployeeSupport",
  "Learning",
  "Compliance",
  "Productivity",
  "Talent",
  "Voice",
  "DocumentIntelligence",
  "EnterpriseVendor",
] as const;

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";

const baseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  timeout: 10000,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as any;
    const token = state?.auth?.token || localStorage.getItem("ofc360_access_token");
    const companyId = state?.auth?.companyId || localStorage.getItem("ofc360_company_id");

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
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as any;
    const refreshToken = state?.auth?.refreshToken || localStorage.getItem("ofc360_refresh_token");

    const requestUrl = typeof args === "string" ? args : args.url;
    if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh")) {
      return result;
    }

    if (!refreshToken) {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/api/v1/auth/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const raw = refreshResult.data as any;
            const resData = raw.data || raw;
            const newToken = resData.access_token || resData.token;
            const newRefreshToken = resData.refresh_token || resData.refreshToken;

            const currentUser = (api.getState() as any)?.auth?.user;
            if (newToken) {
              api.dispatch(
                setCredentials({
                  user: resData.user || currentUser,
                  token: newToken,
                  refreshToken: newRefreshToken || refreshToken,
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
