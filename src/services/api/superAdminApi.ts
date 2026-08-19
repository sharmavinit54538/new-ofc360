import { baseApi } from "./baseApi";
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
      providesTags: ["SuperAdminOrganizations"],
    }),
    getSuperAdminOrganizationDetail: builder.query<any, string>({
      query: (orgId) => `/api/v1/super-admin/organizations/${orgId}`,
      providesTags: (_res, _err, id) => [{ type: "SuperAdminOrganizations", id }],
    }),
    createSuperAdminOrganization: builder.mutation<SuperAdminOrganization, CreateOrganizationPayload>({
      query: (body) => ({
        url: "/api/v1/super-admin/organizations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers", "SuperAdminOnboarding"],
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
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    deleteSuperAdminOrganization: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers"],
    }),
    grantOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; plan?: string }>({
      query: ({ id, plan }) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/grant`,
        method: "POST",
        body: { plan },
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    extendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; days?: number }>({
      query: ({ id, days }) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/extend`,
        method: "POST",
        body: { days: days || 30 },
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    suspendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    cancelOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    reactivateOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/v1/super-admin/organizations/${id}/access/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard"],
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

    // ─── 4. Subscriptions & Billing ───
    getSuperAdminSubscriptions: builder.query<SuperAdminSubscription[], void>({
      query: () => "/api/v1/super-admin/subscriptions",
      providesTags: ["SuperAdminSubscriptions"],
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
    getSuperAdminPayments: builder.query<SuperAdminPayment[], void>({
      query: () => "/api/v1/super-admin/payments",
    }),

    // ─── 5. Security & Sessions ───
    getSuperAdminSecurity: builder.query<SuperAdminSecurityData, void>({
      query: () => "/api/v1/super-admin/security",
      providesTags: ["SuperAdminSecurity"],
    }),
    getSuperAdminSecurityEvents: builder.query<SuperAdminSecurityEvent[], void>({
      query: () => "/api/v1/super-admin/security/events",
      providesTags: ["SuperAdminSecurity"],
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
    resolveSuperAdminSecurityEvent: builder.mutation<{ success: boolean; message: string }, string>({
      query: (eventId) => ({
        url: `/api/v1/super-admin/security/events/${eventId}/resolve`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminSecurity"],
    }),

    // ─── 6. Audit Logs ───
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

    // ─── 7. System Health ───
    getSuperAdminSystemHealth: builder.query<SuperAdminSystemHealthData, void>({
      query: () => "/api/v1/super-admin/system-health",
      providesTags: ["SuperAdminHealth"],
    }),

    // ─── 8. Settings ───
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

    // ─── 9. Onboarding Tracker ───
    getSuperAdminOnboarding: builder.query<SuperAdminOnboardingItem[], void>({
      query: () => "/api/v1/super-admin/onboarding",
      providesTags: ["SuperAdminOnboarding"],
    }),
    fastTrackSuperAdminOnboarding: builder.mutation<{ success: boolean; message: string }, string>({
      query: (orgId) => ({
        url: `/api/v1/super-admin/onboarding/${orgId}/fast-track`,
        method: "POST",
      }),
      invalidatesTags: ["SuperAdminOnboarding", "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),

    // ─── 10. Analytics ───
    getSuperAdminAnalytics: builder.query<SuperAdminAnalyticsData, void>({
      query: () => "/api/v1/super-admin/analytics",
      providesTags: ["SuperAdminAnalytics"],
    }),

    // ─── 11. Announcements ───
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
  useCreateSuperAdminUserMutation,
  useUpdateSuperAdminUserMutation,
  useDeleteSuperAdminUserMutation,
  useToggleSuperAdminUserStatusMutation,
  useResetSuperAdminUserPasswordMutation,
  useGetSuperAdminSubscriptionsQuery,
  useUpdateSuperAdminSubscriptionMutation,
  useGetSuperAdminPlansQuery,
  useGetSuperAdminPaymentsQuery,
  useGetSuperAdminSecurityQuery,
  useGetSuperAdminSecurityEventsQuery,
  useGetSuperAdminSessionsQuery,
  useTerminateSuperAdminSessionMutation,
  useResolveSuperAdminSecurityEventMutation,
  useGetSuperAdminAuditLogsQuery,
  useClearSuperAdminAuditLogsMutation,
  useGetSuperAdminSystemHealthQuery,
  useGetSuperAdminSettingsQuery,
  useUpdateSuperAdminSettingsMutation,
  useGetSuperAdminOnboardingQuery,
  useFastTrackSuperAdminOnboardingMutation,
  useGetSuperAdminAnalyticsQuery,
  useGetSuperAdminAnnouncementsQuery,
  useCreateSuperAdminAnnouncementMutation,
} = superAdminApi;
