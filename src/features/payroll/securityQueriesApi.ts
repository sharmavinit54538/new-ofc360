import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SecurityRole, SecurityPolicy, SecuritySession, IpWhitelistEntry } from "./types";
const tag = "Security";
export const securityQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityRoles: builder.query<APIResponse<SecurityRole[]>, void>({ query: () => "/v2/payroll/security/roles", providesTags: [{ type: tag, id: "ROLES" }] }),
    getSecurityPolicies: builder.query<APIResponse<SecurityPolicy>, void>({ query: () => "/v2/payroll/security/policies", providesTags: [{ type: tag, id: "POLICIES" }] }),
    getSecuritySessions: builder.query<APIResponse<SecuritySession[]>, void>({ query: () => "/v2/payroll/security/sessions", providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: tag as const, id: `SESSION_${id}` })), { type: tag, id: "SESSIONS" }] : [{ type: tag, id: "SESSIONS" }] }),
    getSecurityIpWhitelist: builder.query<APIResponse<IpWhitelistEntry[]>, void>({ query: () => "/v2/payroll/security/ip-whitelist", providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: tag as const, id: `IP_${id}` })), { type: tag, id: "IP_WHITELIST" }] : [{ type: tag, id: "IP_WHITELIST" }] }),
    getSecurityAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/security/audit", providesTags: [{ type: tag, id: "AUDIT" }] }),
  }),
});
export const { useGetSecurityRolesQuery, useGetSecurityPoliciesQuery, useGetSecuritySessionsQuery, useGetSecurityIpWhitelistQuery, useGetSecurityAuditQuery } = securityQueriesApi;
