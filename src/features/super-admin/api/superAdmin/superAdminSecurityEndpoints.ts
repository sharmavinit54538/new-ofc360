import { api as baseApi } from "@/api/client";
import { store } from "@/app/store";
import { SuperAdminSecurityData, SuperAdminSecurityEvent, SuperAdminSession } from "@/types/superAdmin.types";

export const superAdminSecurityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminSecurity: builder.query<SuperAdminSecurityData, void>({ query: () => "/api/v1/super-admin/security", providesTags: ["SuperAdminSecurity"] }),
    getSuperAdminSecurityEvents: builder.query<SuperAdminSecurityEvent[], void>({ query: () => "/api/v1/super-admin/security/events", providesTags: ["SuperAdminSecurity"] }),
    getSuperAdminSecurityAlerts: builder.query<SuperAdminSecurityEvent[], void>({ query: () => "/api/v1/super-admin/security/alerts", providesTags: ["SuperAdminSecurity"] }),
    resolveSuperAdminSecurityEvent: builder.mutation<{ success: boolean; message: string }, string>({ query: (id) => ({ url: `/api/v1/super-admin/security/events/${id}/resolve`, method: "POST" }), invalidatesTags: ["SuperAdminSecurity"] }),
    blockIpAddress: builder.mutation<{ success: boolean; message: string }, string>({ query: (ip) => ({ url: "/api/v1/super-admin/security/block-ip", method: "POST", body: { ip } }), invalidatesTags: ["SuperAdminSecurity"] }),
    unblockIpAddress: builder.mutation<{ success: boolean; message: string }, string>({ query: (ip) => ({ url: "/api/v1/super-admin/security/unblock-ip", method: "POST", body: { ip } }), invalidatesTags: ["SuperAdminSecurity"] }),
    getSuperAdminSessions: builder.query<SuperAdminSession[], void>({ query: () => "/api/v1/super-admin/security/sessions", providesTags: ["SuperAdminSecurity"] }),
    terminateSuperAdminSession: builder.mutation<{ success: boolean; message: string }, string>({ query: (id) => ({ url: `/api/v1/super-admin/security/sessions/${id}/terminate`, method: "POST" }), invalidatesTags: ["SuperAdminSecurity"] }),
    terminateAllSuperAdminSessions: builder.mutation<{ success: boolean; message: string }, void>({ query: () => ({ url: "/api/v1/super-admin/security/sessions/terminate-all", method: "POST" }), invalidatesTags: ["SuperAdminSecurity"] }),
  }),
});
export const {
  useGetSuperAdminSecurityQuery, useGetSuperAdminSecurityEventsQuery, useGetSuperAdminSecurityAlertsQuery,
  useResolveSuperAdminSecurityEventMutation, useBlockIpAddressMutation, useUnblockIpAddressMutation,
  useGetSuperAdminSessionsQuery, useTerminateSuperAdminSessionMutation, useTerminateAllSuperAdminSessionsMutation,
} = superAdminSecurityApi;
export const useResolveSecurityEventMutation = useResolveSuperAdminSecurityEventMutation;
export const useBlockIpMutation = useBlockIpAddressMutation;
export const useUnblockIpMutation = useUnblockIpAddressMutation;
export const useTerminateSessionMutation = useTerminateSuperAdminSessionMutation;
export const useTerminateAllSessionsMutation = useTerminateAllSuperAdminSessionsMutation;
export const getSecurityEvents = async (): Promise<SuperAdminSecurityEvent[]> => store.dispatch(superAdminSecurityApi.endpoints.getSuperAdminSecurityEvents.initiate()).unwrap();
export const getSecurityAlerts = async (): Promise<SuperAdminSecurityEvent[]> => store.dispatch(superAdminSecurityApi.endpoints.getSuperAdminSecurityAlerts.initiate()).unwrap();
export const resolveSecurityEvent = async (id: string): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminSecurityApi.endpoints.resolveSuperAdminSecurityEvent.initiate(id)).unwrap();
export const blockIp = async (ip: string): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminSecurityApi.endpoints.blockIpAddress.initiate(ip)).unwrap();
export const unblockIp = async (ip: string): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminSecurityApi.endpoints.unblockIpAddress.initiate(ip)).unwrap();
export const getSessions = async (): Promise<SuperAdminSession[]> => store.dispatch(superAdminSecurityApi.endpoints.getSuperAdminSessions.initiate()).unwrap();
export const terminateSession = async (id: string): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminSecurityApi.endpoints.terminateSuperAdminSession.initiate(id)).unwrap();
export const terminateAllSessions = async (): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminSecurityApi.endpoints.terminateAllSuperAdminSessions.initiate()).unwrap();
