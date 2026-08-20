import { baseApi } from "@/services/api/baseApi";
import {
  OnboardingAPIResponse,
  OnboardingStatusResponse,
  CompanyOnboardingProgressData,
  CompanyProfilePayload,
  AdminProfilePayload,
  HRSettingsPayload,
  DepartmentItem,
  DesignationItem,
  InviteEmployeesPayload,
  ActivateAccountPayload,
  ValidateTokenResponse,
} from "./types";
import { handleOnboardingRedirect } from "./onboardingUiSlice";

const BASE_PATH = "/api/v1/onboarding";

export const companyOnboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /status — current company onboarding status
    getCompanyOnboardingStatus: builder.query<
      OnboardingAPIResponse<OnboardingStatusResponse>,
      void
    >({
      query: () => `${BASE_PATH}/status`,
      providesTags: ["CompanyOnboarding"],
    }),

    // GET /progress — saved progress data for prefill on wizard re-entry
    getCompanyOnboardingProgress: builder.query<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      void
    >({
      query: () => `${BASE_PATH}/progress`,
      providesTags: ["CompanyOnboarding"],
    }),

    // POST /company — Step 1: company info
    saveCompanyStep1: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      CompanyProfilePayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/company`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /admin-profile — Step 2: admin profile details
    saveAdminProfileStep2: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      AdminProfilePayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/admin-profile`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /hr-settings — Step 3: HR settings
    saveHRSettingsStep3: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      HRSettingsPayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/hr-settings`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /departments — Step 4: departments array
    saveDepartmentsStep4: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      { departments: DepartmentItem[] | string[] }
    >({
      query: (body) => ({
        url: `${BASE_PATH}/departments`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /designations — Step 5: designations array
    saveDesignationsStep5: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      { designations: DesignationItem[] | string[] }
    >({
      query: (body) => ({
        url: `${BASE_PATH}/designations`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /invite-employees — Step 6: bulk employee invites
    inviteEmployeesStep6: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
      InviteEmployeesPayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/invite-employees`,
        method: "POST",
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // POST /complete — Step 7: finalize onboarding
    completeCompanyOnboardingStep7: builder.mutation<
      OnboardingAPIResponse<CompanyOnboardingProgressData>,
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
      invalidatesTags: ["CompanyOnboarding"],
    }),

    // GET /validate-token — primary validation hook
    validateToken: builder.query<
      OnboardingAPIResponse<ValidateTokenResponse>,
      string
    >({
      query: (token) => `${BASE_PATH}/validate-token?token=${encodeURIComponent(token)}`,
    }),

    // GET /validate — fallback validation hook if primary fails
    validateTokenFallback: builder.query<
      OnboardingAPIResponse<ValidateTokenResponse>,
      string
    >({
      query: (token) => `${BASE_PATH}/validate?token=${encodeURIComponent(token)}`,
    }),

    // POST /activate — activate invited employee account
    activateAccount: builder.mutation<
      OnboardingAPIResponse<{ message: string; user_id?: string }>,
      ActivateAccountPayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/activate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyOnboarding"],
    }),
  }),
});

export const {
  useGetCompanyOnboardingStatusQuery,
  useGetCompanyOnboardingProgressQuery,
  useSaveCompanyStep1Mutation,
  useSaveAdminProfileStep2Mutation,
  useSaveHRSettingsStep3Mutation,
  useSaveDepartmentsStep4Mutation,
  useSaveDesignationsStep5Mutation,
  useInviteEmployeesStep6Mutation,
  useCompleteCompanyOnboardingStep7Mutation,
  useValidateTokenQuery,
  useValidateTokenFallbackQuery,
  useActivateAccountMutation,
} = companyOnboardingApi;