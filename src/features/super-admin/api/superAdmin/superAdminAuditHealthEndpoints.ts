import { api as baseApi } from "@/api/client";
import { store } from "@/app/store";
import { SuperAdminAuditLogItem, SuperAdminSystemHealthData, SuperAdminSettings } from "@/types/superAdmin.types";

export const superAdminAuditHealthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminAuditLogs: builder.query<SuperAdminAuditLogItem[], { search?: string; action?: string; page?: number; page_size?: number } | void>({
      query: (params) => ({ url: "/api/v1/super-admin/audit-logs", params: params || undefined }),
      providesTags: ["SuperAdminAuditLogs"],
    }),
    clearSuperAdminAuditLogs: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: "/api/v1/super-admin/audit-logs", method: "DELETE" }),
      invalidatesTags: ["SuperAdminAuditLogs"],
    }),
    getSuperAdminSystemHealth: builder.query<SuperAdminSystemHealthData, void>({
      query: () => "/api/v1/super-admin/system-health",
      providesTags: ["SuperAdminHealth"],
    }),
    getSuperAdminSettings: builder.query<SuperAdminSettings, void>({
      query: () => "/api/v1/super-admin/settings",
      providesTags: ["SuperAdminSettings"],
    }),
    updateSuperAdminSettings: builder.mutation<{ success: boolean; settings: SuperAdminSettings; message: string }, Partial<SuperAdminSettings>>({
      query: (body) => ({ url: "/api/v1/super-admin/settings", method: "PATCH", body }),
      invalidatesTags: ["SuperAdminSettings"],
    }),
  }),
});
export const {
  useGetSuperAdminAuditLogsQuery, useClearSuperAdminAuditLogsMutation, useGetSuperAdminSystemHealthQuery,
  useGetSuperAdminSettingsQuery, useUpdateSuperAdminSettingsMutation,
} = superAdminAuditHealthApi;
export const useClearAuditLogsMutation = useClearSuperAdminAuditLogsMutation;
export const useUpdateSettingsMutation = useUpdateSuperAdminSettingsMutation;
export const getAuditLogs = async (params?: { search?: string; action?: string; page?: number; page_size?: number }): Promise<SuperAdminAuditLogItem[]> => store.dispatch(superAdminAuditHealthApi.endpoints.getSuperAdminAuditLogs.initiate(params || undefined)).unwrap();
export const getSystemHealth = async (): Promise<SuperAdminSystemHealthData> => store.dispatch(superAdminAuditHealthApi.endpoints.getSuperAdminSystemHealth.initiate()).unwrap();
export const getSettings = async (): Promise<SuperAdminSettings> => store.dispatch(superAdminAuditHealthApi.endpoints.getSuperAdminSettings.initiate()).unwrap();
export const updateSettings = async (data: Partial<SuperAdminSettings>): Promise<{ success: boolean; settings: SuperAdminSettings; message: string }> => store.dispatch(superAdminAuditHealthApi.endpoints.updateSuperAdminSettings.initiate(data)).unwrap();
