import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { isValidToken, isValidUUID, isPublicRequest, needsCompanyId } from "@/services/auth/authStorage";
import { createAuthBaseQueryWithReauth } from "@/services/auth/authInterceptor";

export { isPublicRequest, isValidToken, isValidUUID, needsCompanyId } from "@/services/auth/authStorage";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";

export const baseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  timeout: 15000,
  credentials: "include",
  fetchFn: async (input: RequestInfo | URL, init?: RequestInit) => {
    if (input instanceof Request) {
      return fetch(input);
    }
    return fetch(input, { ...init, credentials: init?.credentials || "include" });
  },
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token;
    const companyId = state?.auth?.companyId || state?.company?.activeCompany?.id;

    const isPublic = isPublicRequest(undefined, endpoint);

    if (isValidToken(token) && !isPublic) {
      headers.set("Authorization", `Bearer ${token.trim()}`);
    }

    if (companyId && isValidUUID(companyId) && !isPublic) {
      headers.set("X-Company-ID", companyId.trim());
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = createAuthBaseQueryWithReauth(baseQuery);

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Employee",
    "Attendance",
    "AttendanceAnalytics",
    "Leave",
    "Payroll",
    "PayrollAnalytics",
    "Payslip",
    "Recruitment",
    "Job",
    "Candidate",
    "Onboarding",
    "Department",
    "Manager",
    "Company",
    "Settings",
    "Reports",
    "Performance",
    "SuperAdminOrganizations",
    "SuperAdminDashboard",
    "Timeline",
    "EmployeeOnboarding",
    "Document",
    "HRAdminOnboarding",
  ],
  endpoints: () => ({}),
});

export type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";