import { baseApi } from "../baseApi";
import { Manager, ManagerPermissions } from "@/types/hr";
import type { SendManagerInvitePayload, ActivateManagerPayload } from "./managerApiTypes";

export const managerPermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateManagerPermissions: builder.mutation<Manager, { id: string; permissions: ManagerPermissions | Record<string, unknown> }>({
      query: ({ id, permissions }) => ({ url: `/api/v1/managers/${id}/permissions`, method: "PATCH", body: permissions }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Manager", id }],
    }),
    getMyManagerProfile: builder.query<Manager, void>({
      query: () => "/api/v1/managers/profile",
      transformResponse: (raw: any) => raw?.data || raw,
      providesTags: [{ type: "Manager", id: "ME" }],
    }),
    sendManagerInvite: builder.mutation<{ success: boolean; message?: string }, SendManagerInvitePayload>({
      query: (body) => ({ url: "/api/v1/managers/send-invite", method: "POST", body }),
      transformResponse: (raw: any) => raw?.data || raw || { success: true },
    }),
    sendManagerInvitationById: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({ url: `/api/v1/managers/${id}/send-invitation`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw || { success: true },
    }),
    activateManager: builder.mutation<Manager, ActivateManagerPayload>({
      query: ({ id, ...body }) => ({ url: `/api/v1/managers/${id}/activate`, method: "POST", body }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Manager", id }, { type: "Manager", id: "LIST" }],
    }),
    activateManagerByAdmin: builder.mutation<Manager, string>({
      query: (id) => ({ url: `/api/v1/managers/${id}/activate-by-admin`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, id) => [{ type: "Manager", id }, { type: "Manager", id: "LIST" }],
    }),
    deactivateManager: builder.mutation<Manager, string>({
      query: (id) => ({ url: `/api/v1/managers/${id}/deactivate`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, id) => [{ type: "Manager", id }, { type: "Manager", id: "LIST" }],
    }),
  }),
});
export const {
  useUpdateManagerPermissionsMutation, useGetMyManagerProfileQuery, useSendManagerInviteMutation,
  useSendManagerInvitationByIdMutation, useActivateManagerMutation, useActivateManagerByAdminMutation,
  useDeactivateManagerMutation,
} = managerPermissionsApi;
