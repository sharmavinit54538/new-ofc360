import { baseApi } from "@/services/api/baseApi";
import {
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
} from "./types";
import { handleOnboardingRedirect } from "./onboardingUiSlice";

const BASE_PATH = "/api/v1/employee-onboarding";

export const employeeOnboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /status — employee onboarding status
    getEmployeeOnboardingStatus: builder.query<
      OnboardingAPIResponse<EmployeeOnboardingStatus>,
      void
    >({
      query: () => `${BASE_PATH}/status`,
      providesTags: ["EmployeeOnboarding"],
    }),

    // GET /progress — saved progress data for prefill
    getEmployeeOnboardingProgress: builder.query<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      void
    >({
      query: () => `${BASE_PATH}/progress`,
      providesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/1 — Personal Information & Addresses
    saveEmployeeStep1: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep1Personal
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/1`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/2 — Bank Details
    saveEmployeeStep2: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep2Bank
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/2`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/3 — Statutory IDs (PAN, Aadhaar, Passport, PF, ESI)
    saveEmployeeStep3: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep3Statutory
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/3`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/4 — Emergency Contacts
    saveEmployeeStep4: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep4EmergencyContact
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/4`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/5 — Education Details
    saveEmployeeStep5: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep5Education
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/5`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/6 — Prior Employment
    saveEmployeeStep6: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep6PriorEmployment
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/6`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/7 — Additional Personal Details
    saveEmployeeStep7: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep7AdditionalDetails
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/7`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // POST /step/8/upload — document upload (multipart FormData: file, document_type)
    uploadStep8Document: builder.mutation<
      OnboardingAPIResponse<EmployeeStep8Document>,
      FormData
    >({
      query: (formData) => ({
        url: `${BASE_PATH}/step/8/upload`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // DELETE /step/8/document/{doc_id} — remove uploaded document
    deleteStep8Document: builder.mutation<
      OnboardingAPIResponse<{ success: boolean; doc_id: string }>,
      string
    >({
      query: (docId) => ({
        url: `${BASE_PATH}/step/8/document/${docId}`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/8 — finalize step 8 metadata after uploads
    finalizeStep8Documents: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep8FinalizePayload | void
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/8`,
        method: "PUT",
        body: body || {},
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // PUT /step/9 — final step policies acceptance
    saveEmployeeStep9: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      EmployeeStep9Policies
    >({
      query: (body) => ({
        url: `${BASE_PATH}/step/9`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // POST /complete — finalize employee onboarding
    completeEmployeeOnboarding: builder.mutation<
      OnboardingAPIResponse<EmployeeOnboardingProgressData>,
      void
    >({
      query: () => ({
        url: `${BASE_PATH}/complete`,
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleOnboardingRedirect(data, dispatch);
        } catch (err: any) {
          if (err?.error?.data) {
            handleOnboardingRedirect(err.error.data, dispatch);
          }
        }
      },
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // POST /draft — save in-progress draft state
    saveEmployeeDraft: builder.mutation<
      OnboardingAPIResponse<{ saved: boolean; timestamp: string }>,
      Record<string, any>
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