import { baseApi } from "../baseApi";
import type { EmployeeOnboardingStatusResponse, EmployeeOnboardingProgressResponse } from "./employeeOnboardingTypes";

export const employeeOnboardingStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingStatus: builder.query<EmployeeOnboardingStatusResponse, void>({
      query: () => "/api/v1/employee-onboarding/status",
      providesTags: ["EmployeeOnboarding"],
    }),
    getEmployeeOnboardingProgress: builder.query<EmployeeOnboardingProgressResponse, void>({
      query: () => "/api/v1/employee-onboarding/progress",
      providesTags: ["EmployeeOnboarding"],
    }),
    completeEmployeeOnboarding: builder.mutation<any, void>({
      query: () => ({ url: "/api/v1/employee-onboarding/complete", method: "POST" }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
  }),
});
export const { useGetEmployeeOnboardingStatusQuery, useGetEmployeeOnboardingProgressQuery, useCompleteEmployeeOnboardingMutation } = employeeOnboardingStatusApi;
