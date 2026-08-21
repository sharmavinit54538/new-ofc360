import { baseApi } from "../baseApi";

export const employeeOnboardingPersonalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveStep1Personal: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/1", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep2Identity: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/2", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep3EmergencyContacts: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/3", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
  }),
});
export const { useSaveStep1PersonalMutation, useSaveStep2IdentityMutation, useSaveStep3EmergencyContactsMutation } = employeeOnboardingPersonalApi;
