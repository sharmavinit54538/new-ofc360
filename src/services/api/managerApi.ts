import { baseApi } from "./baseApi";
import { Manager, ManagerPermissions } from "@/types/hr";
import { RawEnvelope } from "./envelope";

export interface GetManagersQueryParams {
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type GetManagersQueryArg = GetManagersQueryParams | void;

export interface SendManagerInvitePayload {
  managerId?: string;
  email?: string;
}

export interface ActivateManagerPayload {
  id: string;
  token?: string;
  password?: string;
  [key: string]: unknown;
}

export interface ActivateManagerOnboardingPayload {
  token: string;
  password?: string;
  full_name?: string;
  [key: string]: unknown;
}

export interface ValidateOnboardingTokenResponse {
  valid: boolean;
  email?: string;
  managerId?: string;
  [key: string]: unknown;
}

export interface ResetPasswordResponse {
  temporaryPassword?: string;
  message?: string;
}

export const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagers: builder.query<Manager[], GetManagersQueryArg>({
      query: (params) => {
        const p = params as GetManagersQueryParams | undefined;
        const qp = new URLSearchParams();
        if (p?.department && p.department !== "ALL") qp.append("department", p.department);
        if (p?.status && p.status !== "ALL") qp.append("status", p.status);
        if (p?.search) qp.append("search", p.search);
        if (p?.page) qp.append("page", String(p.page));
        if (p?.limit) qp.append("limit", String(p.limit));
        const qs = qp.toString();
        return `/api/v1/managers${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): Manager[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        if (Array.isArray(payload)) {
          return payload;
        }
        if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) return payload.items;
          if (Array.isArray(payload.managers)) return payload.managers;
          if (Array.isArray(payload.data)) return payload.data;
        }
        return [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Manager" as const, id })),
              { type: "Manager", id: "LIST" },
            ]
          : [{ type: "Manager", id: "LIST" }],
    }),

    getManagerById: builder.query<Manager, string>({
      query: (id) => `/api/v1/managers/${id}`,
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      providesTags: (_result, _error, id) => [{ type: "Manager", id }],
    }),

    createManager: builder.mutation<Manager, Omit<Manager, "id"> | Partial<Manager>>({
      query: (body) => ({
        url: "/api/v1/managers",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),

    updateManager: builder.mutation<Manager, { id: string; manager: Partial<Manager> }>({
      query: ({ id, manager }) => ({
        url: `/api/v1/managers/${id}`,
        method: "PUT",
        body: manager,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    deleteManager: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; id: string }> | { success: boolean; id: string }, _meta, arg) =>
        (raw as RawEnvelope<{ success: boolean; id: string }>)?.data || (raw as { success: boolean; id: string }) || { success: true, id: arg },
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    updateManagerPermissions: builder.mutation<Manager, { id: string; permissions: ManagerPermissions | Record<string, unknown> }>({
      query: ({ id, permissions }) => ({
        url: `/api/v1/managers/${id}/permissions`,
        method: "PATCH",
        body: permissions,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Manager", id }],
    }),

    getMyManagerProfile: builder.query<Manager, void>({
      query: () => "/api/v1/managers/profile",
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      providesTags: [{ type: "Manager", id: "ME" }],
    }),

    sendManagerInvite: builder.mutation<{ success: boolean; message?: string }, SendManagerInvitePayload>({
      query: (body) => ({
        url: "/api/v1/managers/send-invite",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    sendManagerInvitationById: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/send-invitation`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    activateManager: builder.mutation<Manager, ActivateManagerPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/managers/${id}/activate`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    activateManagerByAdmin: builder.mutation<Manager, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/activate-by-admin`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    deactivateManager: builder.mutation<Manager, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/deactivate`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    resetManagerPassword: builder.mutation<ResetPasswordResponse, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/reset-password`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<ResetPasswordResponse> | ResetPasswordResponse) =>
        (raw as RawEnvelope<ResetPasswordResponse>)?.data || (raw as ResetPasswordResponse),
    }),

    validateManagerOnboardingToken: builder.query<ValidateOnboardingTokenResponse, string>({
      query: (token) => `/api/v1/managers/onboarding/validate?token=${encodeURIComponent(token)}`,
      transformResponse: (raw: RawEnvelope<ValidateOnboardingTokenResponse> | ValidateOnboardingTokenResponse) =>
        (raw as RawEnvelope<ValidateOnboardingTokenResponse>)?.data || (raw as ValidateOnboardingTokenResponse),
    }),

    activateManagerOnboarding: builder.mutation<Manager, ActivateManagerOnboardingPayload>({
      query: (body) => ({
        url: "/api/v1/managers/onboarding/activate",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),

    completeManagerOnboarding: builder.mutation<Manager, Record<string, unknown> | void>({
      query: (body) => ({
        url: "/api/v1/managers/onboarding/complete",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),
  }),
});

export const {
  useGetManagersQuery,
  useLazyGetManagersQuery,
  useGetManagerByIdQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useUpdateManagerPermissionsMutation,
  useGetMyManagerProfileQuery,
  useSendManagerInviteMutation,
  useSendManagerInvitationByIdMutation,
  useActivateManagerMutation,
  useActivateManagerByAdminMutation,
  useDeactivateManagerMutation,
  useResetManagerPasswordMutation,
  useValidateManagerOnboardingTokenQuery,
  useLazyValidateManagerOnboardingTokenQuery,
  useActivateManagerOnboardingMutation,
  useCompleteManagerOnboardingMutation,
} = managerApi;
