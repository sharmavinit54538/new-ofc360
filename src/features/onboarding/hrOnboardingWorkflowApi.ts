import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  Workflow,
  CreateWorkflowPayload,
  NewHireTrackItem,
  CreateNewHirePayload,
  DocumentRequirement,
  CreateDocumentRequirementPayload,
  OnboardingTaskRequirement,
  CreateTaskRequirementPayload,
} from "./types";

const BASE_PATH = "/api/v1/hr-admin/onboarding";

export const hrOnboardingWorkflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Operational Flow Status ──────────────────────────────────────────────
    getWorkflowStatus: builder.query<APIResponse<any>, void>({
      query: () => `${BASE_PATH}/status`,
      providesTags: ["OnboardingWorkflow"],
    }),

    getWorkflowData: builder.query<APIResponse<any>, void>({
      query: () => BASE_PATH,
      providesTags: ["OnboardingWorkflow"],
    }),

    saveWorkflowStep: builder.mutation<
      APIResponse<any>,
      { stepIndex: number; body: Record<string, any> }
    >({
      query: ({ stepIndex, body }) => ({
        url: `${BASE_PATH}/step/${stepIndex}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["OnboardingWorkflow"],
    }),

    completeWorkflow: builder.mutation<APIResponse<any>, void>({
      query: () => ({
        url: `${BASE_PATH}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["OnboardingWorkflow"],
    }),

    // ─── Workflows (Tag: OnboardingWorkflow) ──────────────────────────────────
    listWorkflows: builder.query<APIResponse<Workflow[]>, void>({
      query: () => `${BASE_PATH}/workflows`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "OnboardingWorkflow" as const,
                id,
              })),
              { type: "OnboardingWorkflow", id: "LIST" },
            ]
          : [{ type: "OnboardingWorkflow", id: "LIST" }],
    }),

    createWorkflow: builder.mutation<APIResponse<Workflow>, CreateWorkflowPayload>({
      query: (body) => ({
        url: `${BASE_PATH}/workflows`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "OnboardingWorkflow", id: "LIST" }],
    }),

    deleteWorkflow: builder.mutation<APIResponse<{ id: string }>, string>({
      query: (workflowId) => ({
        url: `${BASE_PATH}/workflows/${workflowId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OnboardingWorkflow", id },
        { type: "OnboardingWorkflow", id: "LIST" },
      ],
    }),

    // ─── New Hires (Tag: NewHire) ──────────────────────────────────────────────
    listNewHires: builder.query<APIResponse<NewHireTrackItem[]>, void>({
      query: () => `${BASE_PATH}/new-hires`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "NewHire" as const,
                id,
              })),
              { type: "NewHire", id: "LIST" },
            ]
          : [{ type: "NewHire", id: "LIST" }],
    }),

    createNewHire: builder.mutation<APIResponse<NewHireTrackItem>, CreateNewHirePayload>({
      query: (body) => ({
        url: `${BASE_PATH}/new-hires`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "NewHire", id: "LIST" },
        { type: "OnboardingTask", id: "LIST" },
        { type: "OnboardingAdmin", id: "LIST" },
      ],
    }),

    updateNewHire: builder.mutation<
      APIResponse<NewHireTrackItem>,
      { hireId: string; body: Partial<NewHireTrackItem> }
    >({
      query: ({ hireId, body }) => ({
        url: `${BASE_PATH}/new-hires/${hireId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { hireId }) => [
        { type: "NewHire", id: hireId },
        { type: "NewHire", id: "LIST" },
        { type: "OnboardingTask", id: "LIST" },
        { type: "OnboardingAdmin", id: "LIST" },
      ],
    }),

    deleteNewHire: builder.mutation<APIResponse<{ id: string }>, string>({
      query: (hireId) => ({
        url: `${BASE_PATH}/new-hires/${hireId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "NewHire", id },
        { type: "NewHire", id: "LIST" },
        { type: "OnboardingTask", id: "LIST" },
        { type: "OnboardingAdmin", id: "LIST" },
      ],
    }),

    // ─── Documents (Tag: OnboardingDocument) ──────────────────────────────────
    listDocumentRequirements: builder.query<APIResponse<DocumentRequirement[]>, void>({
      query: () => `${BASE_PATH}/documents`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "OnboardingDocument" as const,
                id,
              })),
              { type: "OnboardingDocument", id: "LIST" },
            ]
          : [{ type: "OnboardingDocument", id: "LIST" }],
    }),

    createDocumentRequirement: builder.mutation<
      APIResponse<DocumentRequirement>,
      CreateDocumentRequirementPayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/documents`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "OnboardingDocument", id: "LIST" }],
    }),

    updateDocumentRequirement: builder.mutation<
      APIResponse<DocumentRequirement>,
      { docId: string; body: Partial<CreateDocumentRequirementPayload> }
    >({
      query: ({ docId, body }) => ({
        url: `${BASE_PATH}/documents/${docId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { docId }) => [
        { type: "OnboardingDocument", id: docId },
        { type: "OnboardingDocument", id: "LIST" },
      ],
    }),

    deleteDocumentRequirement: builder.mutation<APIResponse<{ id: string }>, string>({
      query: (docId) => ({
        url: `${BASE_PATH}/documents/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OnboardingDocument", id },
        { type: "OnboardingDocument", id: "LIST" },
      ],
    }),

    // ─── Tasks (Tag: OnboardingTask) ──────────────────────────────────────────
    listTasks: builder.query<APIResponse<OnboardingTaskRequirement[]>, void>({
      query: () => `${BASE_PATH}/tasks`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "OnboardingTask" as const,
                id,
              })),
              { type: "OnboardingTask", id: "LIST" },
            ]
          : [{ type: "OnboardingTask", id: "LIST" }],
    }),

    createTask: builder.mutation<
      APIResponse<OnboardingTaskRequirement>,
      CreateTaskRequirementPayload
    >({
      query: (body) => ({
        url: `${BASE_PATH}/tasks`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "OnboardingTask", id: "LIST" }],
    }),

    updateTask: builder.mutation<
      APIResponse<OnboardingTaskRequirement>,
      { taskId: string; body: Partial<OnboardingTaskRequirement> }
    >({
      query: ({ taskId, body }) => ({
        url: `${BASE_PATH}/tasks/${taskId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "OnboardingTask", id: taskId },
        { type: "OnboardingTask", id: "LIST" },
      ],
    }),

    deleteTask: builder.mutation<APIResponse<{ id: string }>, string>({
      query: (taskId) => ({
        url: `${BASE_PATH}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OnboardingTask", id },
        { type: "OnboardingTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWorkflowStatusQuery,
  useGetWorkflowDataQuery,
  useSaveWorkflowStepMutation,
  useCompleteWorkflowMutation,
  useListWorkflowsQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
  useListNewHiresQuery,
  useCreateNewHireMutation,
  useUpdateNewHireMutation,
  useDeleteNewHireMutation,
  useListDocumentRequirementsQuery,
  useCreateDocumentRequirementMutation,
  useUpdateDocumentRequirementMutation,
  useDeleteDocumentRequirementMutation,
  useListTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = hrOnboardingWorkflowApi;