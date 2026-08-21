import { baseApi } from "../baseApi";

export const employeeOnboardingProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveStep4Education: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/4", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep5Experience: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/5", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep6Bank: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/6", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep7Tax: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/7", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
  }),
});
export const { useSaveStep4EducationMutation, useSaveStep5ExperienceMutation, useSaveStep6BankMutation, useSaveStep7TaxMutation } = employeeOnboardingProfileApi;
