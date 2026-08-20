import { baseApi } from "./baseApi";

export interface EmployeeOnboardingStatusResponse {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string;
}

export interface EmployeeOnboardingProgressResponse {
  step_1_personal?: Record<string, any>;
  step_2_identity?: Record<string, any>;
  step_3_emergency_contacts?: Record<string, any>;
  step_4_education?: Record<string, any>;
  step_5_experience?: Record<string, any>;
  step_6_bank?: Record<string, any>;
  step_7_tax?: Record<string, any>;
  step_8_documents?: Array<{ id: string; name: string; type: string; status: string; url?: string }>;
  step_9_policies?: Record<string, any>;
  completed_steps?: number[];
  is_completed?: boolean;
}

export interface EmployeeDocumentUploadResponse {
  id: string;
  name: string;
  type: string;
  status: string;
  url?: string;
  uploaded_at: string;
}

export const employeeOnboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingStatus: builder.query<EmployeeOnboardingStatusResponse, void>({
      query: () => "/api/v1/employee-onboarding/status",
      providesTags: ["EmployeeOnboarding"],
    }),

    getEmployeeOnboardingProgress: builder.query<EmployeeOnboardingProgressResponse, void>({
      query: () => "/api/v1/employee-onboarding/progress",
      providesTags: ["EmployeeOnboarding"],
    }),

    saveStep1Personal: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/1",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep2Identity: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/2",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep3EmergencyContacts: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/3",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep4Education: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/4",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep5Experience: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/5",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep6Bank: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/6",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep7Tax: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/7",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    uploadStep8Document: builder.mutation<EmployeeDocumentUploadResponse, FormData>({
      query: (formData) => ({
        url: "/api/v1/employee-onboarding/step/8/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    deleteStep8Document: builder.mutation<{ success: boolean }, string>({
      query: (docId) => ({
        url: `/api/v1/employee-onboarding/step/8/document/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    completeStep8Documents: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/employee-onboarding/step/8",
        method: "PUT",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveStep9Policies: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/step/9",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    completeEmployeeOnboarding: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/employee-onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
  }),
});

export const {
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveStep1PersonalMutation,
  useSaveStep2IdentityMutation,
  useSaveStep3EmergencyContactsMutation,
  useSaveStep4EducationMutation,
  useSaveStep5ExperienceMutation,
  useSaveStep6BankMutation,
  useSaveStep7TaxMutation,
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useCompleteStep8DocumentsMutation,
  useSaveStep9PoliciesMutation,
  useCompleteEmployeeOnboardingMutation,
} = employeeOnboardingApi;