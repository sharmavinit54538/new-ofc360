import { baseApi } from "../baseApi";
import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { Workflow, CreateWorkflowPayload } from "@/types/hrAdminOnboardingApi.types";

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminWorkflowsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHRAdminWorkflows: builder.query<Workflow[], void>({
      query: () => `${BASE}/workflows`,
      transformResponse: (raw: RawEnvelope<Workflow[]>) => unwrapEnvelope(raw),
      providesTags: (res) => res ? [...res.map(({ id }) => ({ type: "HRAdminWorkflow" as const, id })), { type: "HRAdminWorkflow", id: "LIST" }] : [{ type: "HRAdminWorkflow", id: "LIST" }],
    }),
    createHRAdminWorkflow: builder.mutation<Workflow, CreateWorkflowPayload>({
      query: (body) => ({ url: `${BASE}/workflows`, method: "POST", body }),
      transformResponse: (raw: RawEnvelope<Workflow>) => unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminWorkflow", id: "LIST" }],
    }),
    deleteHRAdminWorkflow: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `${BASE}/workflows/${id}`, method: "DELETE" }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, id) => [{ type: "HRAdminWorkflow", id }, { type: "HRAdminWorkflow", id: "LIST" }],
    }),
  }),
});
export const { useListHRAdminWorkflowsQuery, useCreateHRAdminWorkflowMutation, useDeleteHRAdminWorkflowMutation } = hrAdminWorkflowsApi;
