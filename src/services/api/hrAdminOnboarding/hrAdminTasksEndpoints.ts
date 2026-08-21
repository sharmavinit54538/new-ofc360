import { baseApi } from "../baseApi";
import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { OnboardingTask, CreateTaskPayload, UpdateTaskPayload, ListFilters } from "@/types/hrAdminOnboardingApi.types";

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminTasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHRAdminTasks: builder.query<OnboardingTask[], ListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status) params.set("status", filters.status);
        if (filters?.search) params.set("search", filters.search);
        const qs = params.toString();
        return `${BASE}/tasks${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<OnboardingTask[]>) => unwrapEnvelope(raw),
      providesTags: (res) => res ? [...res.map(({ id }) => ({ type: "HRAdminTask" as const, id })), { type: "HRAdminTask", id: "LIST" }] : [{ type: "HRAdminTask", id: "LIST" }],
    }),
    createHRAdminTask: builder.mutation<OnboardingTask, CreateTaskPayload>({
      query: (body) => ({ url: `${BASE}/tasks`, method: "POST", body }),
      transformResponse: (raw: RawEnvelope<OnboardingTask>) => unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminTask", id: "LIST" }],
    }),
    updateHRAdminTask: builder.mutation<OnboardingTask, { id: string; payload: UpdateTaskPayload }>({
      query: ({ id, payload }) => ({ url: `${BASE}/tasks/${id}`, method: "PATCH", body: payload }),
      transformResponse: (raw: RawEnvelope<OnboardingTask>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, { id }) => [{ type: "HRAdminTask", id }, { type: "HRAdminTask", id: "LIST" }],
    }),
    deleteHRAdminTask: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `${BASE}/tasks/${id}`, method: "DELETE" }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, id) => [{ type: "HRAdminTask", id }, { type: "HRAdminTask", id: "LIST" }],
    }),
  }),
});
export const { useListHRAdminTasksQuery, useCreateHRAdminTaskMutation, useUpdateHRAdminTaskMutation, useDeleteHRAdminTaskMutation } = hrAdminTasksApi;
