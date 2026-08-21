import { baseApi } from "../baseApi";
import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { OnboardingDocument, CreateDocumentPayload, UpdateDocumentPayload, ListFilters } from "@/types/hrAdminOnboardingApi.types";

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminDocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHRAdminDocuments: builder.query<OnboardingDocument[], ListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status) params.set("status", filters.status);
        if (filters?.search) params.set("search", filters.search);
        const qs = params.toString();
        return `${BASE}/documents${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: RawEnvelope<OnboardingDocument[]>) => unwrapEnvelope(raw),
      providesTags: (res) => res ? [...res.map(({ id }) => ({ type: "HRAdminDocument" as const, id })), { type: "HRAdminDocument", id: "LIST" }] : [{ type: "HRAdminDocument", id: "LIST" }],
    }),
    createHRAdminDocument: builder.mutation<OnboardingDocument, CreateDocumentPayload>({
      query: (body) => ({ url: `${BASE}/documents`, method: "POST", body }),
      transformResponse: (raw: RawEnvelope<OnboardingDocument>) => unwrapEnvelope(raw),
      invalidatesTags: [{ type: "HRAdminDocument", id: "LIST" }],
    }),
    updateHRAdminDocument: builder.mutation<OnboardingDocument, { id: string; payload: UpdateDocumentPayload }>({
      query: ({ id, payload }) => ({ url: `${BASE}/documents/${id}`, method: "PATCH", body: payload }),
      transformResponse: (raw: RawEnvelope<OnboardingDocument>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, { id }) => [{ type: "HRAdminDocument", id }, { type: "HRAdminDocument", id: "LIST" }],
    }),
    deleteHRAdminDocument: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `${BASE}/documents/${id}`, method: "DELETE" }),
      transformResponse: (raw: RawEnvelope<{ id: string }>) => unwrapEnvelope(raw),
      invalidatesTags: (_res, _err, id) => [{ type: "HRAdminDocument", id }, { type: "HRAdminDocument", id: "LIST" }],
    }),
  }),
});
export const { useListHRAdminDocumentsQuery, useCreateHRAdminDocumentMutation, useUpdateHRAdminDocumentMutation, useDeleteHRAdminDocumentMutation } = hrAdminDocumentsApi;
