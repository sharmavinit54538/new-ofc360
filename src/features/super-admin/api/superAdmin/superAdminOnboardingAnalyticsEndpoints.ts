import { api as baseApi } from "@/api/client";
import { store } from "@/app/store";
import { SuperAdminOnboardingItem, SuperAdminAnalyticsData, SuperAdminAnnouncement } from "@/types/superAdmin.types";

export const superAdminOnboardingAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminOnboarding: builder.query<SuperAdminOnboardingItem[], void>({ query: () => "/api/v1/super-admin/onboarding", providesTags: ["SuperAdminOnboarding"] }),
    getSuperAdminOrgOnboarding: builder.query<any, string>({ query: (id) => `/api/v1/super-admin/onboarding/${id}`, providesTags: (_res, _err, id) => [{ type: "SuperAdminOnboarding", id }] }),
    fastTrackSuperAdminOnboarding: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/onboarding/${id}/fast-track`, method: "POST" }),
      invalidatesTags: ["SuperAdminOnboarding", "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    getSuperAdminAnalytics: builder.query<SuperAdminAnalyticsData, void>({ query: () => "/api/v1/super-admin/analytics", providesTags: ["SuperAdminAnalytics"] }),
    getSuperAdminAIUsage: builder.query<any, void>({ query: () => "/api/v1/super-admin/analytics/ai-usage" }),
    getSuperAdminAnnouncements: builder.query<SuperAdminAnnouncement[], void>({ query: () => "/api/v1/super-admin/announcements" }),
    createSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, Partial<SuperAdminAnnouncement>>({ query: (body) => ({ url: "/api/v1/super-admin/announcements", method: "POST", body }) }),
    updateSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<SuperAdminAnnouncement> }>({ query: ({ id, data }) => ({ url: `/api/v1/super-admin/announcements/${id}`, method: "PATCH", body: data }) }),
    deleteSuperAdminAnnouncement: builder.mutation<{ success: boolean; message: string }, string>({ query: (id) => ({ url: `/api/v1/super-admin/announcements/${id}`, method: "DELETE" }) }),
  }),
});
export const {
  useGetSuperAdminOnboardingQuery, useGetSuperAdminOrgOnboardingQuery, useFastTrackSuperAdminOnboardingMutation,
  useGetSuperAdminAnalyticsQuery, useGetSuperAdminAIUsageQuery, useGetSuperAdminAnnouncementsQuery,
  useCreateSuperAdminAnnouncementMutation, useUpdateSuperAdminAnnouncementMutation, useDeleteSuperAdminAnnouncementMutation,
} = superAdminOnboardingAnalyticsApi;
export const useFastTrackOnboardingMutation = useFastTrackSuperAdminOnboardingMutation;
export const useCreateAnnouncementMutation = useCreateSuperAdminAnnouncementMutation;
export const useUpdateAnnouncementMutation = useUpdateSuperAdminAnnouncementMutation;
export const useDeleteAnnouncementMutation = useDeleteSuperAdminAnnouncementMutation;
export const getOnboarding = async (): Promise<SuperAdminOnboardingItem[]> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.getSuperAdminOnboarding.initiate()).unwrap();
export const getOrganizationOnboarding = async (id: string): Promise<any> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.getSuperAdminOrgOnboarding.initiate(id)).unwrap();
export const getAnalytics = async (): Promise<SuperAdminAnalyticsData> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.getSuperAdminAnalytics.initiate()).unwrap();
export const getAIUsage = async (): Promise<any> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.getSuperAdminAIUsage.initiate()).unwrap();
export const getAnnouncements = async (): Promise<SuperAdminAnnouncement[]> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.getSuperAdminAnnouncements.initiate()).unwrap();
export const createAnnouncement = async (data: Partial<SuperAdminAnnouncement>): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.createSuperAdminAnnouncement.initiate(data)).unwrap();
export const updateAnnouncement = async (id: string, data: Partial<SuperAdminAnnouncement>): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.updateSuperAdminAnnouncement.initiate({ id, data })).unwrap();
export const deleteAnnouncement = async (id: string): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminOnboardingAnalyticsApi.endpoints.deleteSuperAdminAnnouncement.initiate(id)).unwrap();
