import { baseApi } from "../baseApi";
import type { LoginRequest, LoginResponse, RegisterRequest } from "./authApiTypes";
import { unwrapLoginResponse } from "./unwrapLoginResponse";

export const authLoginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/api/v1/auth/login", method: "POST", body }),
      transformResponse: (raw: any) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (body) => ({ url: "/api/v1/auth/register", method: "POST", body }),
      transformResponse: (raw: any) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth"],
    }),
    logoutSession: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: "/api/v1/auth/logout", method: "POST" }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "Logged out" }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});
export const { useLoginMutation, useRegisterMutation, useLogoutSessionMutation } = authLoginApi;
