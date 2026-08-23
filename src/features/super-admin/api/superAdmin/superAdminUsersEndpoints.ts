import { api as baseApi } from "@/api/client";
import { SuperAdminUser, CreateUserPayload, UpdateUserPayload } from "@/types/superAdmin.types";

export const superAdminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminUsers: builder.query<SuperAdminUser[], { role?: string; status?: string; organization_id?: string; search?: string; page?: number; page_size?: number } | void>({
      query: (params) => ({ url: "/api/v1/super-admin/users", params: params || undefined }),
      providesTags: ["SuperAdminUsers"],
    }),
    getSuperAdminUserDetail: builder.query<SuperAdminUser, string>({
      query: (id) => `/api/v1/super-admin/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: "SuperAdminUsers", id }],
    }),
    createSuperAdminUser: builder.mutation<SuperAdminUser, CreateUserPayload>({
      query: (body) => ({ url: "/api/v1/super-admin/users", method: "POST", body }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    updateSuperAdminUser: builder.mutation<{ success: boolean; message: string }, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({ url: `/api/v1/super-admin/users/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deleteSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    activateSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/users/${id}/activate`, method: "POST" }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deactivateSuperAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/users/${id}/deactivate`, method: "POST" }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    toggleSuperAdminUserStatus: builder.mutation<{ success: boolean; is_active: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/users/${id}/toggle-status`, method: "POST" }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    resetSuperAdminUserPassword: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/users/${id}/reset-password`, method: "POST" }),
      invalidatesTags: ["SuperAdminAuditLogs"],
    }),
    getSuperAdminHRAdmins: builder.query<SuperAdminUser[], { search?: string; status?: string } | void>({
      query: (params) => ({ url: "/api/v1/super-admin/hr-admins", params: params || undefined }),
      providesTags: ["SuperAdminUsers"],
    }),
    createSuperAdminHRAdmin: builder.mutation<SuperAdminUser, CreateUserPayload>({
      query: (body) => ({ url: "/api/v1/super-admin/hr-admins", method: "POST", body }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    updateSuperAdminHRAdmin: builder.mutation<{ success: boolean; message: string }, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({ url: `/api/v1/super-admin/hr-admins/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
    deleteSuperAdminHRAdmin: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/api/v1/super-admin/hr-admins/${id}`, method: "DELETE" }),
      invalidatesTags: ["SuperAdminUsers", "SuperAdminDashboard"],
    }),
  }),
});
export const {
  useGetSuperAdminUsersQuery, useGetSuperAdminUserDetailQuery, useCreateSuperAdminUserMutation,
  useUpdateSuperAdminUserMutation, useDeleteSuperAdminUserMutation, useActivateSuperAdminUserMutation,
  useDeactivateSuperAdminUserMutation, useToggleSuperAdminUserStatusMutation, useResetSuperAdminUserPasswordMutation,
  useGetSuperAdminHRAdminsQuery, useCreateSuperAdminHRAdminMutation, useUpdateSuperAdminHRAdminMutation, useDeleteSuperAdminHRAdminMutation,
} = superAdminUsersApi;
