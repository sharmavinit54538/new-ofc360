import { baseApi } from "../baseApi";
import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { NewHire, CreateNewHirePayload, UpdateNewHirePayload, ListFilters } from "@/types/hrAdminOnboardingApi.types";

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminNewHiresApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHRAdminNewHires: builder.query<NewHire[], ListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status) params.set("status", filters.status);
        if (filters?.search) params.set("search", filters.search);
        const qs = params.toString();
        return `${BASE}/new-hires${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<NewHire[]>) => unwrapEnvelope(raw),
      providesTags: (res) => res ? [...res.map(({ id }) => ({ type: "HRAdminNewHire" as const, id })), { type: "HRAdminNewHire", id: "LIST" }] : [{ type: "HRAdminNewHire", id: "LIST" }],
    }),
    createHRAdminNewHire: builder.mutation<NewHire, CreateNewHirePayload>({
      query: (body) => ({ url: `${BASE}/new-hires`, method: "POST", body }),
      transformResponse: (raw: RawEnvelope<NewHire>) => unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminNewHire", id: "LIST" }],
    }),
    updateHRAdminNewHire: builder.mutation<NewHire, { id: string; payload: UpdateNewHirePayload }>({
      query: ({ id, payload }) => ({ url: `${BASE}/new-hires/${id}`, method: "PATCH", body: payload }),
      transformResponse: (raw: RawEnvelope<NewHire>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, { id }) => [{ type: "HRAdminNewHire", id }, { type: "HRAdminNewHire", id: "LIST" }],
    }),
    deleteHRAdminNewHire: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `${BASE}/new-hires/${id}`, method: "DELETE" }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, id) => [{ type: "HRAdminNewHire", id }, { type: "HRAdminNewHire", id: "LIST" }],
    }),
  }),
});
export const { useListHRAdminNewHiresQuery, useCreateHRAdminNewHireMutation, useUpdateHRAdminNewHireMutation, useDeleteHRAdminNewHireMutation } = hrAdminNewHiresApi;
