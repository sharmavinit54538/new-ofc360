import { baseApi } from "../baseApi";
import type { ChangePasswordRequest } from "./authPasswordTypes";

export const authChangePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (body) => ({ url: "/api/v1/auth/change-password", method: "POST", body: { old_password: body.old_password || body.oldPassword, new_password: body.new_password || body.newPassword } }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "Password changed successfully" }),
    }),
  }),
});
export const { useChangePasswordMutation } = authChangePasswordApi;
