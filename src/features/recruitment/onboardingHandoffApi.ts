import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  CompanyOnboardingStatus,
  EmployeeOnboardingStatus,
  AdminOnboardingProgress,
  HRAdminWorkflow,
  HRAdminNewHire,
  HRAdminDocument,
  HRAdminTask,
} from "./types";

export const onboardingHandoffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. COMPANY ONBOARDING WIZARD (/api/v1/onboarding)
    // ==========================================
    getCompanyOnboardingStatus: builder.query<
      APIResponse<CompanyOnboardingStatus>,
      void
    >({
      query: () => "/api/v1/onboarding/status",
      providesTags: ["Onboarding"],
    }),

    getCompanyOnboardingProgress: builder.query<
      APIResponse<{ current_step: number; total_steps: number; steps_completed: string[] }>,
      void
    >({
      query: () => "/api/v1/onboarding/progress",
      providesTags: ["Onboarding"],
    }),

    submitCompanyInfo: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/company",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    submitAdminProfile: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/admin-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    submitHrSettings: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/hr-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    submitDepartments: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    submitDesignations: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/designations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    inviteEmployees: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/onboarding/invite-employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    completeCompanyOnboarding: builder.mutation<APIResponse<void>, void>({
      query: () => ({
        url: "/api/v1/onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["Onboarding"],
    }),

    validateOnboarding: builder.query<APIResponse<{ valid: boolean }>, void>({
      query: () => "/api/v1/onboarding/validate",
      providesTags: ["Onboarding"],
    }),

    validateOnboardingToken: builder.query<APIResponse<{ valid: boolean }>, string>({
      query: (token) => `/api/v1/onboarding/validate-token?token=${token}`,
      providesTags: ["Onboarding"],
    }),

    activateCompany: builder.mutation<APIResponse<void>, { token: string }>({
      query: (body) => ({
        url: "/api/v1/onboarding/activate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Onboarding"],
    }),

    // ==========================================
    // 2. EMPLOYEE-SIDE ONBOARDING (/api/v1/employee-onboarding)
    // ==========================================
    getEmployeeOnboardingStatus: builder.query<
      APIResponse<EmployeeOnboardingStatus>,
      void
    >({
      query: () => "/api/v1/employee-onboarding/status",
      providesTags: ["EmployeeOnboarding"],
    }),

    getEmployeeOnboardingProgress: builder.query<
      APIResponse<{ current_step: number; completed_steps: number[] }>,
      void
    >({
      query: () => "/api/v1/employee-onboarding/progress",
      providesTags: ["EmployeeOnboarding"],
    }),

    // Steps 1 through 9
    saveEmployeeStep1: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/1", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep2: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/2", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep3: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/3", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep4: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/4", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep5: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/5", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep6: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/6", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep7: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/7", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep8: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/8", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),
    saveEmployeeStep9: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({ url: "/api/v1/employee-onboarding/step/9", method: "PUT", body }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    uploadStep8Document: builder.mutation<APIResponse<{ document_id: string; url: string }>, FormData>({
      query: (formData) => ({
        url: "/api/v1/employee-onboarding/step/8/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    deleteStep8Document: builder.mutation<APIResponse<{ success: boolean }>, string>({
      query: (docId) => ({
        url: `/api/v1/employee-onboarding/step/8/document/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    completeEmployeeOnboarding: builder.mutation<APIResponse<void>, void>({
      query: () => ({
        url: "/api/v1/employee-onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    saveEmployeeOnboardingDraft: builder.mutation<APIResponse<void>, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/employee-onboarding/draft",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeOnboarding"],
    }),

    // ==========================================
    // 3. ADMIN OVERSIGHT (/api/v1/admin/employee-onboarding)
    // ==========================================
    getAllEmployeesOnboardingProgress: builder.query<
      APIResponse<AdminOnboardingProgress[]>,
      void
    >({
      query: () => "/api/v1/admin/employee-onboarding",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ employee_id }) => ({
                type: "OnboardingAdmin" as const,
                id: employee_id,
              })),
              { type: "OnboardingAdmin", id: "LIST" },
            ]
          : [{ type: "OnboardingAdmin", id: "LIST" }],
    }),

    getEmployeeOnboardingProgressAdmin: builder.query<
      APIResponse<AdminOnboardingProgress>,
      string
    >({
      query: (employeeId) => `/api/v1/admin/employee-onboarding/${employeeId}`,
      providesTags: (_res, _err, employeeId) => [
        { type: "OnboardingAdmin", id: employeeId },
      ],
    }),

    verifyEmployeeDocument: builder.mutation<
      APIResponse<{ verified: boolean }>,
      { employeeId: string; docId: string; status: "approved" | "rejected" }
    >({
      query: ({ employeeId, docId, status }) => ({
        url: `/api/v1/admin/employee-onboarding/${employeeId}/document/${docId}/verify`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_res, _err, { employeeId }) => [
        { type: "OnboardingAdmin", id: "LIST" },
        { type: "OnboardingAdmin", id: employeeId },
      ],
    }),

    // ==========================================
    // 4. HR ADMIN WORKFLOWS (/api/v1/hr-admin/onboarding)
    // ==========================================
    getHrAdminOnboardingStatus: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => "/api/v1/hr-admin/onboarding/status",
      providesTags: ["HrAdminOnboarding"],
    }),

    getHrAdminOnboardingData: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => "/api/v1/hr-admin/onboarding",
      providesTags: ["HrAdminOnboarding"],
    }),

    submitHrAdminStep: builder.mutation<
      APIResponse<void>,
      { stepIndex: number; body: Record<string, any> }
    >({
      query: ({ stepIndex, body }) => ({
        url: `/api/v1/hr-admin/onboarding/step/${stepIndex}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),

    completeHrAdminOnboarding: builder.mutation<APIResponse<void>, void>({
      query: () => ({
        url: "/api/v1/hr-admin/onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),

    // Workflows
    getWorkflows: builder.query<APIResponse<HRAdminWorkflow[]>, void>({
      query: () => "/api/v1/hr-admin/onboarding/workflows",
      providesTags: ["HrAdminOnboarding"],
    }),
    createWorkflow: builder.mutation<APIResponse<HRAdminWorkflow>, Partial<HRAdminWorkflow>>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/workflows",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    deleteWorkflow: builder.mutation<APIResponse<void>, string>({
      query: (workflowId) => ({
        url: `/api/v1/hr-admin/onboarding/workflows/${workflowId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),

    // New Hires
    getNewHires: builder.query<APIResponse<HRAdminNewHire[]>, void>({
      query: () => "/api/v1/hr-admin/onboarding/new-hires",
      providesTags: ["HrAdminOnboarding"],
    }),
    createNewHire: builder.mutation<APIResponse<HRAdminNewHire>, Partial<HRAdminNewHire>>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/new-hires",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    updateNewHire: builder.mutation<
      APIResponse<HRAdminNewHire>,
      { hireId: string; body: Partial<HRAdminNewHire> }
    >({
      query: ({ hireId, body }) => ({
        url: `/api/v1/hr-admin/onboarding/new-hires/${hireId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    deleteNewHire: builder.mutation<APIResponse<void>, string>({
      query: (hireId) => ({
        url: `/api/v1/hr-admin/onboarding/new-hires/${hireId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),

    // Documents
    getHrDocuments: builder.query<APIResponse<HRAdminDocument[]>, void>({
      query: () => "/api/v1/hr-admin/onboarding/documents",
      providesTags: ["HrAdminOnboarding"],
    }),
    createHrDocument: builder.mutation<APIResponse<HRAdminDocument>, Partial<HRAdminDocument>>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    updateHrDocument: builder.mutation<
      APIResponse<HRAdminDocument>,
      { docId: string; body: Partial<HRAdminDocument> }
    >({
      query: ({ docId, body }) => ({
        url: `/api/v1/hr-admin/onboarding/documents/${docId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    deleteHrDocument: builder.mutation<APIResponse<void>, string>({
      query: (docId) => ({
        url: `/api/v1/hr-admin/onboarding/documents/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),

    // Tasks
    getHrTasks: builder.query<APIResponse<HRAdminTask[]>, void>({
      query: () => "/api/v1/hr-admin/onboarding/tasks",
      providesTags: ["HrAdminOnboarding"],
    }),
    createHrTask: builder.mutation<APIResponse<HRAdminTask>, Partial<HRAdminTask>>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    updateHrTask: builder.mutation<
      APIResponse<HRAdminTask>,
      { taskId: string; body: Partial<HRAdminTask> }
    >({
      query: ({ taskId, body }) => ({
        url: `/api/v1/hr-admin/onboarding/tasks/${taskId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
    deleteHrTask: builder.mutation<APIResponse<void>, string>({
      query: (taskId) => ({
        url: `/api/v1/hr-admin/onboarding/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HrAdminOnboarding"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCompanyOnboardingStatusQuery,
  useGetCompanyOnboardingProgressQuery,
  useSubmitCompanyInfoMutation,
  useSubmitAdminProfileMutation,
  useSubmitHrSettingsMutation,
  useSubmitDepartmentsMutation,
  useSubmitDesignationsMutation,
  useInviteEmployeesMutation,
  useCompleteCompanyOnboardingMutation,
  useValidateOnboardingQuery,
  useValidateOnboardingTokenQuery,
  useActivateCompanyMutation,
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveEmployeeStep1Mutation,
  useSaveEmployeeStep2Mutation,
  useSaveEmployeeStep3Mutation,
  useSaveEmployeeStep4Mutation,
  useSaveEmployeeStep5Mutation,
  useSaveEmployeeStep6Mutation,
  useSaveEmployeeStep7Mutation,
  useSaveEmployeeStep8Mutation,
  useSaveEmployeeStep9Mutation,
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useCompleteEmployeeOnboardingMutation,
  useSaveEmployeeOnboardingDraftMutation,
  useGetAllEmployeesOnboardingProgressQuery,
  useGetEmployeeOnboardingProgressAdminQuery,
  useVerifyEmployeeDocumentMutation,
  useGetHrAdminOnboardingStatusQuery,
  useGetHrAdminOnboardingDataQuery,
  useSubmitHrAdminStepMutation,
  useCompleteHrAdminOnboardingMutation,
  useGetWorkflowsQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
  useGetNewHiresQuery,
  useCreateNewHireMutation,
  useUpdateNewHireMutation,
  useDeleteNewHireMutation,
  useGetHrDocumentsQuery,
  useCreateHrDocumentMutation,
  useUpdateHrDocumentMutation,
  useDeleteHrDocumentMutation,
  useGetHrTasksQuery,
  useCreateHrTaskMutation,
  useUpdateHrTaskMutation,
  useDeleteHrTaskMutation,
} = onboardingHandoffApi;