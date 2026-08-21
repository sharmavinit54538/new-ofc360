import { baseApi } from "../baseApi";
import type { InviteEmployeesRequest, ActivateAccountRequest } from "./onboardingApiTypes";

export const onboardingOrganizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveDepartments: builder.mutation<any, { departments: string[] }>({
      query: (body) => ({ url: "/api/v1/onboarding/departments", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    saveDesignations: builder.mutation<any, { designations: string[] }>({
      query: (body) => ({ url: "/api/v1/onboarding/designations", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    inviteEmployees: builder.mutation<any, InviteEmployeesRequest>({
      query: (body) => ({ url: "/api/v1/onboarding/invite-employees", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    validateInvitation: builder.query<{ valid: boolean; email?: string; company_name?: string }, string>({
      query: (token) => ({ url: "/api/v1/onboarding/validate", params: { token } }),
    }),
    activateAccount: builder.mutation<any, ActivateAccountRequest>({
      query: (body) => ({ url: "/api/v1/onboarding/activate", method: "POST", body: { token: body.token, password: body.password || body.new_password, new_password: body.new_password || body.password, confirm_password: body.confirm_password || body.new_password || body.password, ...(body.full_name ? { full_name: body.full_name } : {}) } }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});
export const { useSaveDepartmentsMutation, useSaveDesignationsMutation, useInviteEmployeesMutation, useValidateInvitationQuery, useActivateAccountMutation } = onboardingOrganizationApi;
