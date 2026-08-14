import { baseApi } from "./baseApi";
import { RawEnvelope, unwrapEnvelope } from "./envelope";
import type {
  OnboardingStatusResponse,
  OnboardingWizardData,
  SaveStepPayload,
  Workflow,
  CreateWorkflowPayload,
  NewHire,
  CreateNewHirePayload,
  UpdateNewHirePayload,
  OnboardingDocument,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  OnboardingTask,
  CreateTaskPayload,
  UpdateTaskPayload,
  ListFilters,
} from "@/types/hrAdminOnboardingApi.types";

export function normalizeOnboardingStatusResponse(
  raw: RawEnvelope<OnboardingStatusResponse> | any
): OnboardingStatusResponse {
  const data = unwrapEnvelope(raw) || {};
  const completed = Boolean(
    data.completed ?? data.is_completed ?? data.onboarding_completed ?? false
  );
  const current_step = typeof data.current_step === "number" ? data.current_step : 0;
  const total_steps = typeof data.total_steps === "number" ? data.total_steps : 4;
  return {
    completed,
    current_step,
    total_steps,
  };
}

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminOnboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── A. Wizard ───────────────────────────────────────────────────

    // 1. GET /status
    getHRAdminOnboardingStatus: builder.query<OnboardingStatusResponse, void>({
      query: () => `${BASE}/status`,
      transformResponse: (raw: RawEnvelope<OnboardingStatusResponse> | any) =>
        normalizeOnboardingStatusResponse(raw),
      providesTags: ["HRAdminOnboarding"],
    }),

    // 2. GET / (base path — full wizard data)
    getHRAdminOnboardingWizardData: builder.query<OnboardingWizardData, void>({
      query: () => BASE,
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) =>
        unwrapEnvelope(raw),
      providesTags: ["HRAdminOnboarding"],
    }),

    // 3. POST /step/{step_index}
    saveHRAdminOnboardingStep: builder.mutation<
      OnboardingWizardData,
      { stepIndex: number; payload: SaveStepPayload }
    >({
      query: ({ stepIndex, payload }) => ({
        url: `${BASE}/step/${stepIndex}`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) =>
        unwrapEnvelope(raw),
      invalidatesTags: ["HRAdminOnboarding"],
    }),

    // 4. POST /complete
    completeHRAdminOnboarding: builder.mutation<OnboardingWizardData, void>({
      query: () => ({
        url: `${BASE}/complete`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) =>
        unwrapEnvelope(raw),
      invalidatesTags: ["HRAdminOnboarding"],
    }),

    // ─── B. Workflows ────────────────────────────────────────────────

    // 5. GET /workflows
    listHRAdminWorkflows: builder.query<Workflow[], void>({
      query: () => `${BASE}/workflows`,
      transformResponse: (raw: RawEnvelope<Workflow[]>) =>
        unwrapEnvelope(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "HRAdminWorkflow" as const,
                id,
              })),
              { type: "HRAdminWorkflow", id: "LIST" },
            ]
          : [{ type: "HRAdminWorkflow", id: "LIST" }],
    }),

    // 6. POST /workflows
    createHRAdminWorkflow: builder.mutation<Workflow, CreateWorkflowPayload>({
      query: (body) => ({
        url: `${BASE}/workflows`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Workflow>) =>
        unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminWorkflow", id: "LIST" }],
    }),

    // 7. DELETE /workflows/{workflow_id}
    deleteHRAdminWorkflow: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `${BASE}/workflows/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "HRAdminWorkflow", id },
        { type: "HRAdminWorkflow", id: "LIST" },
      ],
    }),

    // ─── C. New Hires ────────────────────────────────────────────────

    // 8. GET /new-hires
    listHRAdminNewHires: builder.query<NewHire[], ListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          if (filters.status) params.set("status", filters.status);
          if (filters.search) params.set("search", filters.search);
        }
        const qs = params.toString();
        return `${BASE}/new-hires${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<NewHire[]>) =>
        unwrapEnvelope(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "HRAdminNewHire" as const,
                id,
              })),
              { type: "HRAdminNewHire", id: "LIST" },
            ]
          : [{ type: "HRAdminNewHire", id: "LIST" }],
    }),

    // 9. POST /new-hires
    createHRAdminNewHire: builder.mutation<NewHire, CreateNewHirePayload>({
      query: (body) => ({
        url: `${BASE}/new-hires`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<NewHire>) =>
        unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminNewHire", id: "LIST" }],
    }),

    // 10. PATCH /new-hires/{hire_id}
    updateHRAdminNewHire: builder.mutation<
      NewHire,
      { id: string; payload: UpdateNewHirePayload }
    >({
      query: ({ id, payload }) => ({
        url: `${BASE}/new-hires/${id}`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (raw: RawEnvelope<NewHire>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HRAdminNewHire", id },
        { type: "HRAdminNewHire", id: "LIST" },
      ],
    }),

    // 11. DELETE /new-hires/{hire_id}
    deleteHRAdminNewHire: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `${BASE}/new-hires/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "HRAdminNewHire", id },
        { type: "HRAdminNewHire", id: "LIST" },
      ],
    }),

    // ─── D. Documents ────────────────────────────────────────────────

    // 12. GET /documents
    listHRAdminDocuments: builder.query<
      OnboardingDocument[],
      ListFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          if (filters.status) params.set("status", filters.status);
          if (filters.search) params.set("search", filters.search);
        }
        const qs = params.toString();
        return `${BASE}/documents${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<OnboardingDocument[]>) =>
        unwrapEnvelope(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "HRAdminDocument" as const,
                id,
              })),
              { type: "HRAdminDocument", id: "LIST" },
            ]
          : [{ type: "HRAdminDocument", id: "LIST" }],
    }),

    // 13. POST /documents
    createHRAdminDocument: builder.mutation<
      OnboardingDocument,
      CreateDocumentPayload
    >({
      query: (body) => ({
        url: `${BASE}/documents`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<OnboardingDocument>) =>
        unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminDocument", id: "LIST" }],
    }),

    // 14. PATCH /documents/{doc_id}
    updateHRAdminDocument: builder.mutation<
      OnboardingDocument,
      { id: string; payload: UpdateDocumentPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${BASE}/documents/${id}`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (raw: RawEnvelope<OnboardingDocument>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HRAdminDocument", id },
        { type: "HRAdminDocument", id: "LIST" },
      ],
    }),

    // 15. DELETE /documents/{doc_id}
    deleteHRAdminDocument: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `${BASE}/documents/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "HRAdminDocument", id },
        { type: "HRAdminDocument", id: "LIST" },
      ],
    }),

    // ─── E. Tasks ────────────────────────────────────────────────────

    // 16. GET /tasks
    listHRAdminTasks: builder.query<OnboardingTask[], ListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          if (filters.status) params.set("status", filters.status);
          if (filters.search) params.set("search", filters.search);
        }
        const qs = params.toString();
        return `${BASE}/tasks${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<OnboardingTask[]>) =>
        unwrapEnvelope(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "HRAdminTask" as const,
                id,
              })),
              { type: "HRAdminTask", id: "LIST" },
            ]
          : [{ type: "HRAdminTask", id: "LIST" }],
    }),

    // 17. POST /tasks
    createHRAdminTask: builder.mutation<OnboardingTask, CreateTaskPayload>({
      query: (body) => ({
        url: `${BASE}/tasks`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<OnboardingTask>) =>
        unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminTask", id: "LIST" }],
    }),

    // 18. PATCH /tasks/{task_id}
    updateHRAdminTask: builder.mutation<
      OnboardingTask,
      { id: string; payload: UpdateTaskPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${BASE}/tasks/${id}`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (raw: RawEnvelope<OnboardingTask>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HRAdminTask", id },
        { type: "HRAdminTask", id: "LIST" },
      ],
    }),

    // 19. DELETE /tasks/{task_id}
    deleteHRAdminTask: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `${BASE}/tasks/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) =>
        unwrapEnvelope(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "HRAdminTask", id },
        { type: "HRAdminTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // Wizard
  useGetHRAdminOnboardingStatusQuery,
  useGetHRAdminOnboardingWizardDataQuery,
  useSaveHRAdminOnboardingStepMutation,
  useCompleteHRAdminOnboardingMutation,
  // Workflows
  useListHRAdminWorkflowsQuery,
  useCreateHRAdminWorkflowMutation,
  useDeleteHRAdminWorkflowMutation,
  // New Hires
  useListHRAdminNewHiresQuery,
  useCreateHRAdminNewHireMutation,
  useUpdateHRAdminNewHireMutation,
  useDeleteHRAdminNewHireMutation,
  // Documents
  useListHRAdminDocumentsQuery,
  useCreateHRAdminDocumentMutation,
  useUpdateHRAdminDocumentMutation,
  useDeleteHRAdminDocumentMutation,
  // Tasks
  useListHRAdminTasksQuery,
  useCreateHRAdminTaskMutation,
  useUpdateHRAdminTaskMutation,
  useDeleteHRAdminTaskMutation,
} = hrAdminOnboardingApi;
