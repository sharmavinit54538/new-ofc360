import { baseApi } from "../baseApi";
import type { EmployeeDocumentUploadResponse } from "./employeeOnboardingTypes";

export const employeeOnboardingDocsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadStep8Document: builder.mutation<EmployeeDocumentUploadResponse, FormData>({
      query: (formData) => ({ url: "/api/v1/employee-onboarding/step/8/upload", method: "POST", body: formData }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    deleteStep8Document: builder.mutation<{ success: boolean }, string>({
      query: (docId) => ({ url: `/api/v1/employee-onboarding/step/8/document/${docId}`, method: "DELETE" }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    completeStep8Documents: builder.mutation<any, void>({
      query: () => ({ url: "/api/v1/employee-onboarding/step/8", method: "PUT" }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveStep9Policies: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/9", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
  }),
});
export const { useUploadStep8DocumentMutation, useDeleteStep8DocumentMutation, useCompleteStep8DocumentsMutation, useSaveStep9PoliciesMutation } = employeeOnboardingDocsApi;
