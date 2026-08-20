import { baseApi } from "./baseApi";
import { store } from "@/app/store";
import {
  SuperAdminDashboardData,
  SuperAdminOrganization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  SuperAdminUser,
  CreateUserPayload,
  UpdateUserPayload,
  SuperAdminSubscription,
  SuperAdminPlan,
  SuperAdminPayment,
  SuperAdminSecurityData,
  SuperAdminSecurityEvent,
  SuperAdminSession,
  SuperAdminAuditLogItem,
  SuperAdminSystemHealthData,
  SuperAdminSettings,
  SuperAdminOnboardingItem,
  SuperAdminAnalyticsData,
  SuperAdminAnnouncement,
} from "@/types/superAdmin.types";

export const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── 1. Dashboard & Statistics ───
    getSuperAdminDashboard: builder.query<SuperAdminDashboardData, void>({
      query: () => "/api/v1/super-admin/dashboard",
      providesTags: ["SuperAdminDashboard"],
    }),
    getSuperAdminStatistics: builder.query<SuperAdminDashboardData, void>({
      query: () => "/api/v1/super-admin/statistics",
      providesTags: ["SuperAdminDashboard"],
    }),

    // ─── 2. Organizations ───
    getSuperAdminOrganizations: builder.query<
      SuperAdminOrganization[],
      { search?: string; status?: string; plan?: string; page?: number; page_size?: number } | void
    >({
      query: (params) => ({
        url: "/api/v1/super-admin/organizations",
        params: params || undefined,
      }),
      transformResponse: (raw: any): SuperAdminOrganization[] => {
        const items = Array.isArray(raw) ? raw : (raw?.data || []);
        return items.map((org: any) => {
          const count = Number(org.employee_count ?? org.employeeCount ?? 0);
          return {
            ...org,
            employee_count: count,
            employeeCount: count,
          };
        });
      },
      providesTags: ["SuperAdminOrganizations"],
    }),
    getSuperAdminOrganizationDetail: builder.query<any, string>({
      query: (orgId) => `/api/v1/super-admin/organizations/${orgId}`,
      transformResponse: (raw: any): any => {
        const data = raw?.data !== undefined ? raw.data : raw;
        if (data && data.stats) {
          const count = Number(data.stats.employee_count ?? data.stats.employeeCount ?? 0);
          data.stats.employee_count = count;
          data.stats.employeeCount = count;
        }
        return data;
      },
      providesTags: (_res, _err, id) => [{ type: "SuperAdminOrganizations", id }],
    }),
    createSuperAdminOrganization: builder.mutation<SuperAdminOrganization, CreateOrganizationPayload>({
      query: (body) => ({
        url: "/api/v1/super-admin/organizations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers", "SuperAdminOnboarding", "SuperAdminSubscriptions"],
    }),
    updateSuperAdminOrganization: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: UpdateOrganizationPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/organizations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    deleteSuperAdminOrganization: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers", "SuperAdminSubscriptions"],
    }),
    grantOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; plan?: string }>({
      query: ({ id, plan }) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/grant`,
        method: "POST",
        body: { plan },
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    extendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; days?: number }>({
      query: ({ id, days }) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/extend`,
        method: "POST",
        body: { days: days || 30 },
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    suspendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    cancelOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    reactivateOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),

    // ─── 3. Users ───
    getSuperAdminUsers: builder.query<
      SuperAdminUser[],
      { role?: string; status?: string; organization_id?: string; search?: string; page?: number; page_size?: number } | void
    >({
      query: (params) => ({
        url: "/api/v1/super-admin/users",
        params: params || undefined,
      }),
      providesTags: ["SuperAdminUsers"],
    }),
    getSuperAdminUserDetail: builder.query<SuperAdminUser, string>({
      query: (userId) => `/api/v1/super-admin/users/${userId}`,
      providesTags: (_res, _err, id) => [{ type: "SuperAdminUsers", id }],
    }),
    createSuperAdminUser: builder.mutation<SuperAdminUser, CreateUserPayload>({
      query: (body) => ({
        url: "/api/v1/super-admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    updateSuperAdminUser: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deleteSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    activateSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/users/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deactivateSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/users/${id}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    toggleSuperAdminUserStatus: builder.mutation<{ success: boolean; is_active: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/users/${id}/toggle-status`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    resetSuperAdminUserPassword: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/users/${id}/reset-password`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminAuditLogs"],
    }),

    // ─── 4. HR Admins ───
    getSuperAdminHRAdmins: builder.query<
      SuperAdminUser[],
      { search?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "/api/v1/super-admin/hr-admins",
        params: params || undefined,
      }),
      providesTags: ["SuperAdminUsers"],
    }),
    createSuperAdminHRAdmin: builder.mutation<SuperAdminUser, CreateUserPayload>({
      query: (body) => ({
        url: "/api/v1/super-admin/hr-admins",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    updateSuperAdminHRAdmin: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/hr-admins/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deleteSuperAdminHRAdmin: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/hr-admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),

    // ─── 5. Subscriptions, Plans & Billing ───
    getSubscriptions: builder.query<SuperAdminSubscription[], void>({
      query: () => "/api/v1/super-admin/subscriptions",
      providesTags: ["SuperAdminSubscriptions"],
    }),
    getSuperAdminSubscriptions: builder.query<SuperAdminSubscription[], void>({
      query: () => "/api/v1/super-admin/subscriptions",
      providesTags: ["SuperAdminSubscriptions"],
    }),
    getSuperAdminSubscriptionDetail: builder.query<any, string>({
      query: (id) => `/api/v1/super-admin/subscriptions/${id}`,
      providesTags: (_res, _err, id) => [{ type: "SuperAdminSubscriptions", id }],
    }),
    updateSuperAdminSubscription: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: Partial<SuperAdminSubscription> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/subscriptions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuperAdminSubscriptions", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    getSuperAdminPlans: builder.query<SuperAdminPlan[], void>({
      query: () => "/api/v1/super-admin/plans",
    }),
    createSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, Partial<SuperAdminPlan>>({
      query: (body) => ({
        url: "/api/v1/super-admin/plans",
        method: "POST",
        body,
      }),
    }),
    updateSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<SuperAdminPlan> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/plans/${id}`,
        method: "DELETE",
      }),
    }),
    getSuperAdminEntitlements: builder.query<Record<string, boolean>, void>({
      query: () => "/api/v1/super-admin/entitlements",
    }),
    updateSuperAdminEntitlements: builder.mutation<{ success: boolean; message: string }, Record<string, boolean>>({
      query: (body) => ({
        url: "/api/v1/super-admin/entitlements",
        method: "PUT",
        body,
      }),
    }),
    getSuperAdminBilling: builder.query<SuperAdminPayment[], void>({
      query: () => "/api/v1/super-admin/billing",
    }),
    getSuperAdminPayments: builder.query<SuperAdminPayment[], void>({
      query: () => "/api/v1/super-admin/payments",
    }),

    // ─── 6. Security & Sessions ───
    getSuperAdminSecurity: builder.query<SuperAdminSecurityData, void>({
      query: () => "/api/v1/super-admin/security",
      providesTags: ["SuperAdminSecurity"],
    }),
    getSuperAdminSecurityEvents: builder.query<SuperAdminSecurityEvent[], void>({
      query: () => "/api/v1/super-admin/security/events",
      providesTags: ["SuperAdminSecurity"],
    }),
    getSuperAdminSecurityAlerts: builder.query<SuperAdminSecurityEvent[], void>({
      query: () => "/api/v1/super-admin/security/alerts",
      providesTags: ["SuperAdminSecurity"],
    }),
    resolveSuperAdminSecurityEvent: builder.mutation<{ success: boolean; message: string }, string>({
      query: (eventId) => ({
        url: `/api/v1/super-admin/security/events/${eventId}/resolve`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),
    blockIpAddress: builder.mutation<{ success: boolean; message: string }, string>({
      query: (ip) => ({
        url: "/api/v1/super-admin/security/block-ip",
        method: "POST",
        body: { ip },
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),
    unblockIpAddress: builder.mutation<{ success: boolean; message: string }, string>({
      query: (ip) => ({
        url: "/api/v1/super-admin/security/unblock-ip",
        method: "POST",
        body: { ip },
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),
    getSuperAdminSessions: builder.query<SuperAdminSession[], void>({
      query: () => "/api/v1/super-admin/security/sessions",
      providesTags: ["SuperAdminSecurity"],
    }),
    terminateSuperAdminSession: builder.mutation<{ success: boolean; message: string }, string>({
      query: (sessionId) => ({
        url: `/api/v1/super-admin/security/sessions/${sessionId}/terminate`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),
    terminateAllSuperAdminSessions: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/super-admin/security/sessions/terminate-all",
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),

    // ─── 7. Audit Logs ───
    getSuperAdminAuditLogs: builder.query<
      SuperAdminAuditLogItem[],
      { search?: string; action?: string; page?: number; page_size?: number } | void
    >({
      query: (params) => ({
        url: "/api/v1/super-admin/audit-logs",
        params: params || undefined,
      }),
      providesTags: ["SuperAdminAuditLogs"],
    }),
    clearSuperAdminAuditLogs: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/super-admin/audit-logs",
        method: "DELETE",
      }),
      invalidatesTags: ["SuperAdminAuditLogs"],
    }),

    // ─── 8. System Health ───
    getSuperAdminSystemHealth: builder.query<SuperAdminSystemHealthData, void>({
      query: () => "/api/v1/super-admin/system-health",
      providesTags: ["SuperAdminHealth"],
    }),

    // ─── 9. Settings ───
    getSuperAdminSettings: builder.query<SuperAdminSettings, void>({
      query: () => "/api/v1/super-admin/settings",
      providesTags: ["SuperAdminSettings"],
    }),
    updateSuperAdminSettings: builder.mutation<{ success: boolean; settings: SuperAdminSettings; message: string }, Partial<SuperAdminSettings>>({
      query: (body) => ({
        url: "/api/v1/super-admin/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SuperAdminSettings"],
    }),

    // ─── 10. Onboarding Tracker ───
    getSuperAdminOnboarding: builder.query<SuperAdminOnboardingItem[], void>({
      query: () => "/api/v1/super-admin/onboarding",
      providesTags: ["SuperAdminOnboarding"],
    }),
    getSuperAdminOrgOnboarding: builder.query<any, string>({
      query: (orgId) => `/api/v1/super-admin/onboarding/${orgId}`,
      providesTags: (_res, _err, id) => [{ type: "SuperAdminOnboarding", id }],
    }),
    fastTrackSuperAdminOnboarding: builder.mutation<{ success: boolean; message: string }, string>({
      query: (orgId) => ({
        url: `/api/v1/super-admin/onboarding/${orgId}/fast-track`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOnboarding", "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),

    // ─── 11. Analytics ───
    getSuperAdminAnalytics: builder.query<SuperAdminAnalyticsData, void>({
      query: () => "/api/v1/super-admin/analytics",
      providesTags: ["SuperAdminAnalytics"],
    }),
    getSuperAdminAIUsage: builder.query<any, void>({
      query: () => "/api/v1/super-admin/analytics/ai-usage",
    }),

    // ─── 12. Announcements ───
    getSuperAdminAnnouncements: builder.query<SuperAdminAnnouncement[], void>({
      query: () => "/api/v1/super-admin/announcements",
    }),
    createSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, Partial<SuperAdminAnnouncement>>({
      query: (body) => ({
        url: "/api/v1/super-admin/announcements",
        method: "POST",
        body,
      }),
    }),
    updateSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<SuperAdminAnnouncement> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/super-admin/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/announcements/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSuperAdminDashboardQuery,
  useGetSuperAdminStatisticsQuery,
  useGetSuperAdminOrganizationsQuery,
  useGetSuperAdminOrganizationDetailQuery,
  useCreateSuperAdminOrganizationMutation,
  useUpdateSuperAdminOrganizationMutation,
  useDeleteSuperAdminOrganizationMutation,
  useGrantOrganizationAccessMutation,
  useExtendOrganizationAccessMutation,
  useSuspendOrganizationAccessMutation,
  useCancelOrganizationAccessMutation,
  useReactivateOrganizationAccessMutation,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminUserDetailQuery,
  useCreateSuperAdminUserMutation,
  useUpdateSuperAdminUserMutation,
  useDeleteSuperAdminUserMutation,
  useActivateSuperAdminUserMutation,
  useDeactivateSuperAdminUserMutation,
  useToggleSuperAdminUserStatusMutation,
  useResetSuperAdminUserPasswordMutation,
  useGetSuperAdminHRAdminsQuery,
  useCreateSuperAdminHRAdminMutation,
  useUpdateSuperAdminHRAdminMutation,
  useDeleteSuperAdminHRAdminMutation,
  useGetSubscriptionsQuery,
  useGetSuperAdminSubscriptionsQuery,
  useGetSuperAdminSubscriptionDetailQuery,
  useUpdateSuperAdminSubscriptionMutation,
  useGetSuperAdminPlansQuery,
  useCreateSuperAdminPlanMutation,
  useUpdateSuperAdminPlanMutation,
  useDeleteSuperAdminPlanMutation,
  useGetSuperAdminEntitlementsQuery,
  useUpdateSuperAdminEntitlementsMutation,
  useGetSuperAdminBillingQuery,
  useGetSuperAdminPaymentsQuery,
  useGetSuperAdminSecurityQuery,
  useGetSuperAdminSecurityEventsQuery,
  useGetSuperAdminSecurityAlertsQuery,
  useResolveSuperAdminSecurityEventMutation,
  useBlockIpAddressMutation,
  useUnblockIpAddressMutation,
  useGetSuperAdminSessionsQuery,
  useTerminateSuperAdminSessionMutation,
  useTerminateAllSuperAdminSessionsMutation,
  useGetSuperAdminAuditLogsQuery,
  useClearSuperAdminAuditLogsMutation,
  useGetSuperAdminSystemHealthQuery,
  useGetSuperAdminSettingsQuery,
  useUpdateSuperAdminSettingsMutation,
  useGetSuperAdminOnboardingQuery,
  useGetSuperAdminOrgOnboardingQuery,
  useFastTrackSuperAdminOnboardingMutation,
  useGetSuperAdminAnalyticsQuery,
  useGetSuperAdminAIUsageQuery,
  useGetSuperAdminAnnouncementsQuery,
  useCreateSuperAdminAnnouncementMutation,
  useUpdateSuperAdminAnnouncementMutation,
  useDeleteSuperAdminAnnouncementMutation,
} = superAdminApi;

// Hook aliases for component compatibility
export const useResolveSecurityEventMutation = useResolveSuperAdminSecurityEventMutation;
export const useBlockIpMutation = useBlockIpAddressMutation;
export const useUnblockIpMutation = useUnblockIpAddressMutation;
export const useTerminateSessionMutation = useTerminateSuperAdminSessionMutation;
export const useTerminateAllSessionsMutation = useTerminateAllSuperAdminSessionsMutation;
export const useClearAuditLogsMutation = useClearSuperAdminAuditLogsMutation;
export const useUpdateSettingsMutation = useUpdateSuperAdminSettingsMutation;
export const useFastTrackOnboardingMutation = useFastTrackSuperAdminOnboardingMutation;
export const useCreateAnnouncementMutation = useCreateSuperAdminAnnouncementMutation;
export const useUpdateAnnouncementMutation = useUpdateSuperAdminAnnouncementMutation;
export const useDeleteAnnouncementMutation = useDeleteSuperAdminAnnouncementMutation;

// ─── Direct Standalone API Service Functions (Dispatched via RTK Query Store) ───

export const getDashboard = async (): Promise<SuperAdminDashboardData> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminDashboard.initiate()).unwrap();
  return result;
};

export const getStatistics = async (): Promise<SuperAdminDashboardData> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminStatistics.initiate()).unwrap();
  return result;
};

export const getOrganizations = async (params?: { search?: string; status?: string; plan?: string; page?: number; page_size?: number }): Promise<SuperAdminOrganization[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminOrganizations.initiate(params || undefined)).unwrap();
  return result;
};

export const getOrganization = async (id: string): Promise<any> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminOrganizationDetail.initiate(id)).unwrap();
  return result;
};

export const createOrganization = async (data: CreateOrganizationPayload): Promise<SuperAdminOrganization> => {
  const result = await store.dispatch(superAdminApi.endpoints.createSuperAdminOrganization.initiate(data)).unwrap();
  return result;
};

export const updateOrganization = async (id: string, data: UpdateOrganizationPayload): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminOrganization.initiate({ id, data })).unwrap();
  return result;
};

export const grantOrganizationAccess = async (id: string, data?: { plan?: string }): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.grantOrganizationAccess.initiate({ id, plan: data?.plan })).unwrap();
  return result;
};

export const extendOrganizationAccess = async (id: string, data?: { days?: number }): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.extendOrganizationAccess.initiate({ id, days: data?.days })).unwrap();
  return result;
};

export const suspendOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.suspendOrganizationAccess.initiate(id)).unwrap();
  return result;
};

export const cancelOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.cancelOrganizationAccess.initiate(id)).unwrap();
  return result;
};

export const reactivateOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.reactivateOrganizationAccess.initiate(id)).unwrap();
  return result;
};

export const getUsers = async (params?: { role?: string; status?: string; organization_id?: string; search?: string }): Promise<SuperAdminUser[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminUsers.initiate(params || undefined)).unwrap();
  return result;
};

export const createUser = async (data: CreateUserPayload): Promise<SuperAdminUser> => {
  const result = await store.dispatch(superAdminApi.endpoints.createSuperAdminUser.initiate(data)).unwrap();
  return result;
};

export const updateUser = async (id: string, data: UpdateUserPayload): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminUser.initiate({ id, data })).unwrap();
  return result;
};

export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.deleteSuperAdminUser.initiate(id)).unwrap();
  return result;
};

export const activateUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.activateSuperAdminUser.initiate(id)).unwrap();
  return result;
};

export const deactivateUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.deactivateSuperAdminUser.initiate(id)).unwrap();
  return result;
};

export const resetUserPassword = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.resetSuperAdminUserPassword.initiate(id)).unwrap();
  return result;
};

export const getHRAdmins = async (params?: { search?: string; status?: string }): Promise<SuperAdminUser[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminHRAdmins.initiate(params || undefined)).unwrap();
  return result;
};

export const createHRAdmin = async (data: CreateUserPayload): Promise<SuperAdminUser> => {
  const result = await store.dispatch(superAdminApi.endpoints.createSuperAdminHRAdmin.initiate(data)).unwrap();
  return result;
};

export const updateHRAdmin = async (id: string, data: UpdateUserPayload): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminHRAdmin.initiate({ id, data })).unwrap();
  return result;
};

export const deleteHRAdmin = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.deleteSuperAdminHRAdmin.initiate(id)).unwrap();
  return result;
};

export const getOnboarding = async (): Promise<SuperAdminOnboardingItem[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminOnboarding.initiate()).unwrap();
  return result;
};

export const getOrganizationOnboarding = async (id: string): Promise<any> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminOrgOnboarding.initiate(id)).unwrap();
  return result;
};

export const getSubscriptions = async (): Promise<SuperAdminSubscription[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSubscriptions.initiate()).unwrap();
  return result;
};

export const getSubscription = async (id: string): Promise<any> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSubscriptionDetail.initiate(id)).unwrap();
  return result;
};

export const getPlans = async (): Promise<SuperAdminPlan[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminPlans.initiate()).unwrap();
  return result;
};

export const createPlan = async (data: Partial<SuperAdminPlan>): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.createSuperAdminPlan.initiate(data)).unwrap();
  return result;
};

export const updatePlan = async (id: string, data: Partial<SuperAdminPlan>): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminPlan.initiate({ id, data })).unwrap();
  return result;
};

export const getEntitlements = async (): Promise<Record<string, boolean>> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminEntitlements.initiate()).unwrap();
  return result;
};

export const updateEntitlements = async (data: Record<string, boolean>): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminEntitlements.initiate(data)).unwrap();
  return result;
};

export const getBilling = async (): Promise<SuperAdminPayment[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminBilling.initiate()).unwrap();
  return result;
};

export const getPayments = async (): Promise<SuperAdminPayment[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminPayments.initiate()).unwrap();
  return result;
};

export const getAnalytics = async (): Promise<SuperAdminAnalyticsData> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminAnalytics.initiate()).unwrap();
  return result;
};

export const getAIUsage = async (): Promise<any> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminAIUsage.initiate()).unwrap();
  return result;
};

export const getSecurityEvents = async (): Promise<SuperAdminSecurityEvent[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSecurityEvents.initiate()).unwrap();
  return result;
};

export const getSecurityAlerts = async (): Promise<SuperAdminSecurityEvent[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSecurityAlerts.initiate()).unwrap();
  return result;
};

export const resolveSecurityEvent = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.resolveSuperAdminSecurityEvent.initiate(id)).unwrap();
  return result;
};

export const blockIp = async (ip: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.blockIpAddress.initiate(ip)).unwrap();
  return result;
};

export const unblockIp = async (ip: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.unblockIpAddress.initiate(ip)).unwrap();
  return result;
};

export const getSessions = async (): Promise<SuperAdminSession[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSessions.initiate()).unwrap();
  return result;
};

export const terminateSession = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.terminateSuperAdminSession.initiate(id)).unwrap();
  return result;
};

export const terminateAllSessions = async (): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.terminateAllSuperAdminSessions.initiate()).unwrap();
  return result;
};

export const getAuditLogs = async (params?: { search?: string; action?: string; page?: number; page_size?: number }): Promise<SuperAdminAuditLogItem[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminAuditLogs.initiate(params || undefined)).unwrap();
  return result;
};

export const getSystemHealth = async (): Promise<SuperAdminSystemHealthData> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSystemHealth.initiate()).unwrap();
  return result;
};

export const getSettings = async (): Promise<SuperAdminSettings> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminSettings.initiate()).unwrap();
  return result;
};

export const updateSettings = async (data: Partial<SuperAdminSettings>): Promise<{ success: boolean; settings: SuperAdminSettings; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminSettings.initiate(data)).unwrap();
  return result;
};

export const getAnnouncements = async (): Promise<SuperAdminAnnouncement[]> => {
  const result = await store.dispatch(superAdminApi.endpoints.getSuperAdminAnnouncements.initiate()).unwrap();
  return result;
};

export const createAnnouncement = async (data: Partial<SuperAdminAnnouncement>): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.createSuperAdminAnnouncement.initiate(data)).unwrap();
  return result;
};

export const updateAnnouncement = async (id: string, data: Partial<SuperAdminAnnouncement>): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.updateSuperAdminAnnouncement.initiate({ id, data })).unwrap();
  return result;
};

export const deleteAnnouncement = async (id: string): Promise<{ success: boolean; message: string }> => {
  const result = await store.dispatch(superAdminApi.endpoints.deleteSuperAdminAnnouncement.initiate(id)).unwrap();
  return result;
};