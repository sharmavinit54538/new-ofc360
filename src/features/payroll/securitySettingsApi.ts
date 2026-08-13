import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SecurityRole, SecurityPolicy, SecuritySession, IpWhitelistEntry } from "./types";

export const securitySettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityRoles: builder.query<APIResponse<SecurityRole[]>, void>({
      query: () => ({
        url: "/v2/payroll/security/roles",
        method: "GET",
      }),
      providesTags: [{ type: "Security", id: "ROLES" }],
    }),

    getSecurityPolicies: builder.query<APIResponse<SecurityPolicy>, void>({
      query: () => ({
        url: "/v2/payroll/security/policies",
        method: "GET",
      }),
      providesTags: [{ type: "Security", id: "POLICIES" }],
    }),

    updateSecurityPolicies: builder.mutation<APIResponse<SecurityPolicy>, Partial<SecurityPolicy>>({
      query: (body) => ({
        url: "/v2/payroll/security/policies",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Security", id: "POLICIES" }],
    }),

    getSecuritySessions: builder.query<APIResponse<SecuritySession[]>, void>({
      query: () => ({
        url: "/v2/payroll/security/sessions",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Security" as const, id: `SESSION_${id}` })),
              { type: "Security", id: "SESSIONS" },
            ]
          : [{ type: "Security", id: "SESSIONS" }],
    }),

    deleteSecuritySession: builder.mutation<APIResponse<void>, string>({
      query: (sessionId) => ({
        url: `/v2/payroll/security/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, sessionId) => [
        { type: "Security", id: `SESSION_${sessionId}` },
        { type: "Security", id: "SESSIONS" },
      ],
    }),

    securityLogoutAll: builder.mutation<APIResponse<void>, void>({
      query: () => ({
        url: "/v2/payroll/security/logout-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Security", id: "SESSIONS" }],
    }),

    getSecurityIpWhitelist: builder.query<APIResponse<IpWhitelistEntry[]>, void>({
      query: () => ({
        url: "/v2/payroll/security/ip-whitelist",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Security" as const, id: `IP_${id}` })),
              { type: "Security", id: "IP_WHITELIST" },
            ]
          : [{ type: "Security", id: "IP_WHITELIST" }],
    }),

    addSecurityIpWhitelist: builder.mutation<APIResponse<IpWhitelistEntry>, Partial<IpWhitelistEntry>>({
      query: (body) => ({
        url: "/v2/payroll/security/ip-whitelist",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Security", id: "IP_WHITELIST" }],
    }),

    deleteSecurityIpWhitelist: builder.mutation<APIResponse<void>, string>({
      query: (ipId) => ({
        url: `/v2/payroll/security/ip-whitelist/${ipId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, ipId) => [
        { type: "Security", id: `IP_${ipId}` },
        { type: "Security", id: "IP_WHITELIST" },
      ],
    }),

    getSecurityAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/security/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Security", id: "AUDIT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSecurityRolesQuery,
  useGetSecurityPoliciesQuery,
  useUpdateSecurityPoliciesMutation,
  useGetSecuritySessionsQuery,
  useDeleteSecuritySessionMutation,
  useSecurityLogoutAllMutation,
  useGetSecurityIpWhitelistQuery,
  useAddSecurityIpWhitelistMutation,
  useDeleteSecurityIpWhitelistMutation,
  useGetSecurityAuditQuery,
} = securitySettingsApi;
