import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ExitDocumentResponse } from "./types";

export const exitDocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExitDocuments: builder.query<APIResponse<ExitDocumentResponse>, string>({
      query: (exitId) => `/api/v1/exits/${exitId}/documents`,
      providesTags: (_result, _error, exitId) => [
        { type: "ExitDocument" as const, id: exitId },
        { type: "ExitDocument" as const, id: "LIST" },
      ],
    }),

    generateExitDocuments: builder.mutation<
      APIResponse<ExitDocumentResponse>,
      { exitId: string; notes?: string }
    >({
      query: ({ exitId, notes }) => ({
        url: `/api/v1/exits/${exitId}/generate-documents`,
        method: "POST",
        body: { notes },
      }),
      invalidatesTags: (_result, _error, { exitId }) => [
        { type: "ExitDocument" as const, id: exitId },
        { type: "ExitDocument" as const, id: "LIST" },
        { type: "HrDocument" as const, id: "EMPLOYEE_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExitDocumentsQuery,
  useGenerateExitDocumentsMutation,
} = exitDocumentsApi;
