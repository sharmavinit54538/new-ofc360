import { api } from "@/api/client";
import type {
  OnboardingAPIResponse,
  EmployeeOnboardingStatus,
  EmployeeOnboardingProgressData,
  EmployeeStep1Personal,
  EmployeeStep2Bank,
  EmployeeStep3Statutory,
  EmployeeStep4EmergencyContact,
  EmployeeStep5Education,
  EmployeeStep6PriorEmployment,
  EmployeeStep7AdditionalDetails,
  EmployeeStep8Document,
  EmployeeStep8FinalizePayload,
  EmployeeStep9Policies,
} from "@/features/onboarding/types";

export type {
  OnboardingAPIResponse,
  EmployeeOnboardingStatus,
  EmployeeOnboardingProgressData,
  EmployeeStep1Personal,
  EmployeeStep2Bank,
  EmployeeStep3Statutory,
  EmployeeStep4EmergencyContact,
  EmployeeStep5Education,
  EmployeeStep6PriorEmployment,
  EmployeeStep7AdditionalDetails,
  EmployeeStep8Document,
  EmployeeStep8FinalizePayload,
  EmployeeStep9Policies,
} from "@/features/onboarding/types";

const BASE_PATH = "/api/v1/employee-onboarding";

export const employeeOnboardingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingStatus: builder.query<
      OnboardingAPIResponse<EmployeeOnboardingStatus>,
      void
    >({
      query: () => `${BASE_PATH}/status`,
      providesTags: ["EmployeeOnboarding"],
    }),

    getEmployeeOnboardingProgress: builder.query<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      void
    >({
      query: () => `${BASE_PATH}/progress`,
      providesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep1: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep1Personal
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/1`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep2: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep2Bank
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/2`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep3: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep3Statutory
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/3`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep4: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep4EmergencyContact
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/4`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep5: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep5Education
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/5`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep6: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep6PriorEmployment
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/6`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep7: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep7AdditionalDetails
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/7`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    uploadStep8Document: builder.mutation<
      OnboardingAPIResponse<EmployeeStep8Document>,
      FormData
    >({
      query: (formData) => ({
        url: `${BASE_PATH}/step/8/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    deleteStep8Document: builder.mutation<
      OnboardingAPIResponse<{ success: boolean; doc_id: string }>,
      string
    >({
      query: (docId) => ({
        url: `${BASE_PATH}/step/8/document/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    finalizeStep8Documents: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep8FinalizePayload | void
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/8`,
        method: "PUT",
        body: body || {},
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeStep9: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep9Policies
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/9`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    completeEmployeeOnboarding: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      void
    >({
      query: () => ({
        url: `${BASE_PATH}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeDraft: builder.mutation<
      OnboardingAPIResponse<{ saved: boolean; timestamp: string }>,
      Record<string, unknown>
    >({
      query: (body) => ({
        url: `${BASE_PATH}/draft`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveEmployeeStep1Mutation,
  useSaveEmployeeStep2Mutation,
  useSaveEmployeeStep3Mutation,
  useSaveEmployeeStep4Mutation,
  useSaveEmployeeStep5Mutation,
  useSaveEmployeeStep6Mutation,
  useSaveEmployeeStep7Mutation,
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useFinalizeStep8DocumentsMutation,
  useSaveEmployeeStep9Mutation,
  useCompleteEmployeeOnboardingMutation,
  useSaveEmployeeDraftMutation,
} = employeeOnboardingApi;