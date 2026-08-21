import { baseApi } from "../baseApi";
import { Employee } from "@/types/hr";
import type { OnboardingStatus } from "./employeeApiTypes";

export const employeeOnboardingStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    approveOnboarding: builder.mutation<Employee, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/approve`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    rejectOnboarding: builder.mutation<Employee, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/api/v1/employees/${id}/reject`, method: "POST", body: { reason } }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    resetEmployeePassword: builder.mutation<{ temporaryPassword?: string }, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/reset-password`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
    }),
    getOnboardingStatus: builder.query<OnboardingStatus, string>({
      query: (id) => `/api/v1/employees/${id}/onboarding-status`,
      transformResponse: (raw: any) => raw?.data || raw,
      providesTags: (_r, _e, id) => [{ type: "Employee", id: `ONBOARDING-${id}` }],
    }),
    validateEmployeeInvitation: builder.query<{ valid?: boolean; employee_id?: string; [k: string]: any }, string>({
      query: (token) => ({ url: "/api/v1/onboarding/validate", params: { token } }),
      transformResponse: (raw: any) => raw?.data || raw,
    }),
  }),
});
export const { useApproveOnboardingMutation, useRejectOnboardingMutation, useResetEmployeePasswordMutation, useGetOnboardingStatusQuery, useValidateEmployeeInvitationQuery, useLazyValidateEmployeeInvitationQuery } = employeeOnboardingStatusApi;
