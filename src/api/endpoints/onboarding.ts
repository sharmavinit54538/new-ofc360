import { api } from "../client";
import {
  CompanyDetails,
  HRAdminProfile,
  CompanyBranding,
  OnboardingPreferences,
  OnboardingTaskItem,
} from "@/types/hrAdminOnboarding";

export type OnboardingTask = OnboardingTaskItem;

export interface OnboardingStatusResponse {
  onboarding_status: string;
  completed_steps: number[];
  current_step: number;
  is_completed: boolean;
  company_id?: string;
  completion_percentage?: number;
}

export interface OnboardingProgressResponse {
  company?: Partial<CompanyDetails>;
  admin_profile?: Partial<HRAdminProfile>;
  hr_settings?: Partial<OnboardingPreferences>;
  departments?: string[];
  designations?: string[];
  invites?: Array<{ email: string; role: string; department?: string }>;
  completed_steps?: number[];
  current_step?: number;
  is_completed?: boolean;
}

export interface InviteEmployeesRequest {
  invites: Array<{
    email: string;
    name?: string;
    role?: string;
    department?: string;
    designation?: string;
  }>;
}

export interface ActivateAccountRequest {
  token: string;
  password?: string;
  new_password?: string;
  confirm_password?: string;
  full_name?: string;
}

export const onboardingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<OnboardingStatusResponse, void>({
      query: () => "/api/v1/onboarding/status",
      providesTags: ["Onboarding"],
    }),

    getOnboardingProgress: builder.query<OnboardingProgressResponse, void>({
      query: () => "/api/v1/onboarding/progress",
      providesTags: ["Onboarding"],
    }),

    saveCompany: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({
        url: "/api/v1/onboarding/company",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveCompanyDetails: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({
        url: "/api/v1/onboarding/company-details",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    updateCompanyDetails: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({
        url: "/api/v1/onboarding/company-details",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveAdminProfile: builder.mutation<any, Partial<HRAdminProfile>>({
      query: (body) => ({
        url: "/api/v1/onboarding/admin-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    updateAdminProfile: builder.mutation<any, Partial<HRAdminProfile>>({
      query: (body) => ({
        url: "/api/v1/onboarding/admin-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveHRSettings: builder.mutation<any, Partial<OnboardingPreferences>>({
      query: (body) => ({
        url: "/api/v1/onboarding/hr-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveDepartments: builder.mutation<any, { departments: string[] }>({
      query: (body) => ({
        url: "/api/v1/onboarding/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveDesignations: builder.mutation<any, { designations: string[] }>({
      query: (body) => ({
        url: "/api/v1/onboarding/designations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    inviteEmployees: builder.mutation<any, InviteEmployeesRequest>({
      query: (body) => ({
        url: "/api/v1/onboarding/invite-employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    validateInvitation: builder.query<{ valid: boolean; email?: string; company_name?: string }, string>({
      query: (token) => ({
        url: "/api/v1/onboarding/validate",
        params: { token },
      }),
    }),

    validateToken: builder.query<{ valid: boolean; email?: string; company_name?: string }, string>({
      query: (token) => ({
        url: "/api/v1/onboarding/validate-token",
        params: { token },
      }),
    }),

    activateAccount: builder.mutation<any, ActivateAccountRequest>({
      query: (body) => ({
        url: "/api/v1/onboarding/activate",
        method: "POST",
        body: {
          token: body.token,
          password: body.password || body.new_password,
          new_password: body.new_password || body.password,
          confirm_password: body.confirm_password || body.new_password || body.password,
          ...(body.full_name ? { full_name: body.full_name } : {}),
        },
      }),
      invalidatesTags: ["Onboarding"],
    }),

    saveBranding: builder.mutation<any, Partial<CompanyBranding>>({
      query: (body) => ({
        url: "/api/v1/onboarding/branding",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    savePreferences: builder.mutation<any, Partial<OnboardingPreferences>>({
      query: (body) => ({
        url: "/api/v1/onboarding/preferences",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    completeOnboarding: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["Onboarding"],
    }),

    getOnboardingTasks: builder.query<OnboardingTaskItem[], { employeeId?: string }>({
      query: (params) => {
        const query = params?.employeeId ? `?employeeId=${params.employeeId}` : "";
        return `/api/v1/onboarding/tasks${query}`;
      },
      providesTags: ["Onboarding"],
    }),

    updateTaskStatus: builder.mutation<
      OnboardingTaskItem,
      { taskId: string; isCompleted: boolean }
    >({
      query: ({ taskId, isCompleted }) => ({
        url: `/api/v1/onboarding/tasks/${taskId}`,
        method: "PATCH",
        body: { is_completed: isCompleted },
      }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});

export const {
  useGetOnboardingStatusQuery,
  useGetOnboardingProgressQuery,
  useSaveCompanyMutation,
  useSaveCompanyDetailsMutation,
  useUpdateCompanyDetailsMutation,
  useSaveAdminProfileMutation,
  useUpdateAdminProfileMutation,
  useSaveHRSettingsMutation,
  useSaveDepartmentsMutation,
  useSaveDesignationsMutation,
  useInviteEmployeesMutation,
  useValidateInvitationQuery,
  useValidateTokenQuery,
  useActivateAccountMutation,
  useSaveBrandingMutation,
  useSavePreferencesMutation,
  useCompleteOnboardingMutation,
  useGetOnboardingTasksQuery,
  useUpdateTaskStatusMutation,
} = onboardingApi;