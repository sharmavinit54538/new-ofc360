import { baseApi } from "../baseApi";
import { AuthUser, normalizeRole } from "@/features/auth/authTypes";

export const authSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/api/v1/auth/me",
      transformResponse: (raw: any) => {
        const u = raw?.data || raw; if (!u) return u;
        const name = u.name || u.full_name || u.email?.split("@")[0] || "User";
        return { ...u, name, role: normalizeRole(u.role), companyId: u.companyId || u.company_id };
      },
      providesTags: ["Auth", "User"],
    }),
    refreshSession: builder.mutation<{ token: string; refreshToken?: string }, { refreshToken: string }>({
      query: (b) => ({ url: "/api/v1/auth/refresh", method: "POST", body: { refreshToken: b.refreshToken, refresh_token: b.refreshToken } }),
      transformResponse: (r: any) => ({ token: r?.data?.access_token || r?.data?.token || "", refreshToken: r?.data?.refresh_token }),
    }),
  }),
});
export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery, useRefreshSessionMutation } = authSessionApi;
