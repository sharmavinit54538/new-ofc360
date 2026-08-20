import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SecurityPolicy, IpWhitelistEntry } from "./types";
const tag = "Security";
export const securityMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSecurityPolicies: builder.mutation<APIResponse<SecurityPolicy>, Partial<SecurityPolicy>>({ query: (body) => ({ url: "/v2/payroll/security/policies", method: "PUT", body }), invalidatesTags: [{ type: tag, id: "POLICIES" }] }),
    deleteSecuritySession: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/security/sessions/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id: `SESSION_${id}` }, { type: tag, id: "SESSIONS" }] }),
    securityLogoutAll: builder.mutation<APIResponse<void>, void>({ query: () => ({ url: "/v2/payroll/security/logout-all", method: "POST" }), invalidatesTags: [{ type: tag, id: "SESSIONS" }] }),
    addSecurityIpWhitelist: builder.mutation<APIResponse<IpWhitelistEntry>, Partial<IpWhitelistEntry>>({ query: (body) => ({ url: "/v2/payroll/security/ip-whitelist", method: "POST", body }), invalidatesTags: [{ type: tag, id: "IP_WHITELIST" }] }),
    deleteSecurityIpWhitelist: builder.mutation<APIResponse<void>, string>({ query: (id) => ({ url: `/v2/payroll/security/ip-whitelist/${id}`, method: "DELETE" }), invalidatesTags: (_, __, id) => [{ type: tag, id: `IP_${id}` }, { type: tag, id: "IP_WHITELIST" }] }),
  }),
});
export const { useUpdateSecurityPoliciesMutation, useDeleteSecuritySessionMutation, useSecurityLogoutAllMutation, useAddSecurityIpWhitelistMutation, useDeleteSecurityIpWhitelistMutation } = securityMutationsApi;
