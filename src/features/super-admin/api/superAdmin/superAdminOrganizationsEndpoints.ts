import { api as baseApi } from "@/api/client";
import { SuperAdminOrganization, CreateOrganizationPayload, UpdateOrganizationPayload } from "@/types/superAdmin.types";

export const superAdminOrganizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminOrganizations: builder.query<SuperAdminOrganization[], { search?: string; status?: string; plan?: string; page?: number; page_size?: number } | void>({
      query: (params) => ({ url: "/api/v1/super-admin/organizations", params: params || undefined }),
      transformResponse: (raw: any): SuperAdminOrganization[] => {
        const items = Array.isArray(raw) ? raw : (raw?.data || []);
        return items.map((org: any) => { const count = Number(org.employee_count ?? org.employeeCount ?? 0); return { ...org, employee_count: count, employeeCount: count }; });
      },
      providesTags: ["SuperAdminOrganizations"],
    }),
    getSuperAdminOrganizationDetail: builder.query<any, string>({
      query: (orgId) => `/api/v1/super-admin/organizations/${orgId}`,
      transformResponse: (raw: any): any => {
        const data = raw?.data !== undefined ? raw.data : raw;
        if (data?.stats) { const count = Number(data.stats.employee_count ?? data.stats.employeeCount ?? 0); data.stats.employee_count = count; data.stats.employeeCount = count; }
        return data;
      },
      providesTags: (_res, _err, id) => [{ type: "SuperAdminOrganizations", id }],
    }),
    createSuperAdminOrganization: builder.mutation<SuperAdminOrganization, CreateOrganizationPayload>({
      query: (body) => ({ url: "/api/v1/super-admin/organizations", method: "POST", body }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers", "SuperAdminOnboarding", "SuperAdminSubscriptions"],
    }),
    updateSuperAdminOrganization: builder.mutation<{ success: boolean; message: string }, { id: string; data: UpdateOrganizationPayload }>({
      query: ({ id, data }) => ({ url: `/api/v1/super-admin/organizations/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    deleteSuperAdminOrganization: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/organizations/${id}`, method: "DELETE" }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminUsers", "SuperAdminSubscriptions"],
    }),
    grantOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; plan?: string }>({
      query: ({ id, plan }) => ({ url: `/api/v1/super-admin/organizations/${id}/access/grant`, method: "POST", body: { plan } }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    extendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, { id: string; days?: number }>({
      query: ({ id, days }) => ({ url: `/api/v1/super-admin/organizations/${id}/access/extend`, method: "POST", body: { days: days || 30 } }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    suspendOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/organizations/${id}/access/suspend`, method: "POST" }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    cancelOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/organizations/${id}/access/cancel`, method: "POST" }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
    reactivateOrganizationAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/organizations/${id}/access/reactivate`, method: "POST" }),
      invalidatesTags: ["SuperAdminOrganizations", "SuperAdminDashboard", "SuperAdminSubscriptions"],
    }),
  }),
});
export const {
  useGetSuperAdminOrganizationsQuery, useGetSuperAdminOrganizationDetailQuery, useCreateSuperAdminOrganizationMutation,
  useUpdateSuperAdminOrganizationMutation, useDeleteSuperAdminOrganizationMutation, useGrantOrganizationAccessMutation,
  useExtendOrganizationAccessMutation, useSuspendOrganizationAccessMutation, useCancelOrganizationAccessMutation,
  useReactivateOrganizationAccessMutation,
} = superAdminOrganizationsApi;
