import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  DocumentCategory,
  HrDocument,
  UploadEmployeeDocumentInput,
  UploadCompanyDocumentInput,
  UpdateEmployeeDocumentInput,
  DocumentFilterParams,
  RequestSignatureInput,
  SignDocumentInput,
  SignatureStatusResponse,
} from "./types";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Categories
    getCategories: builder.query<APIResponse<DocumentCategory[]>, void>({
      query: () => "/api/v1/documents/categories",
      providesTags: [{ type: "HrDocument", id: "CATEGORIES" }],
    }),

    // Employee Documents
    uploadEmployeeDocument: builder.mutation<
      APIResponse<HrDocument>,
      UploadEmployeeDocumentInput
    >({
      query: (input) => {
        const formData = new FormData();
        formData.append("file", input.file);
        formData.append("employee_id", input.employee_id);
        formData.append("category_id", input.category_id);
        formData.append("title", input.title);
        if (input.description) formData.append("description", input.description);
        if (input.issue_date) formData.append("issue_date", input.issue_date);
        if (input.expiry_date) formData.append("expiry_date", input.expiry_date);
        if (input.visibility) formData.append("visibility", input.visibility);
        if (input.status_field) formData.append("status_field", input.status_field);
        if (input.tags) formData.append("tags", input.tags);

        return {
          url: "/api/v1/documents/employees",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
        { type: "HrDocument", id: "LIST" },
      ],
    }),

    getEmployeeDocuments: builder.query<
      APIResponse<HrDocument[]>,
      DocumentFilterParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.employee_id) queryParams.append("employee_id", params.employee_id);
        if (params?.category_id) queryParams.append("category_id", params.category_id);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryStr = queryParams.toString();
        return `/api/v1/documents/employees${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "HrDocument" as const,
                id,
              })),
              { type: "HrDocument", id: "EMPLOYEE_LIST" },
              { type: "HrDocument", id: "LIST" },
            ]
          : [{ type: "HrDocument", id: "EMPLOYEE_LIST" }],
    }),

    getEmployeeDocumentById: builder.query<APIResponse<HrDocument>, string>({
      query: (id) => `/api/v1/documents/employees/${id}`,
      providesTags: (_res, _err, id) => [{ type: "HrDocument", id }],
    }),

    downloadEmployeeDocument: builder.query<Blob, string>({
      query: (id) => ({
        url: `/api/v1/documents/employees/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    updateEmployeeDocument: builder.mutation<
      APIResponse<HrDocument>,
      UpdateEmployeeDocumentInput
    >({
      query: ({ id, file, ...metadata }) => {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          Object.entries(metadata).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              formData.append(key, String(val));
            }
          });
          return {
            url: `/api/v1/documents/employees/${id}`,
            method: "PUT",
            body: formData,
          };
        }
        return {
          url: `/api/v1/documents/employees/${id}`,
          method: "PUT",
          body: metadata,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    deleteEmployeeDocument: builder.mutation<
      APIResponse<{ success: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/api/v1/documents/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    // Company Documents
    uploadCompanyDocument: builder.mutation<
      APIResponse<HrDocument>,
      UploadCompanyDocumentInput
    >({
      query: (input) => {
        const formData = new FormData();
        formData.append("file", input.file);
        formData.append("category_id", input.category_id);
        formData.append("title", input.title);
        if (input.description) formData.append("description", input.description);

        return {
          url: "/api/v1/documents/company",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "HrDocument", id: "COMPANY_LIST" }],
    }),

    getCompanyDocuments: builder.query<APIResponse<HrDocument[]>, void>({
      query: () => "/api/v1/documents/company",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "HrDocument" as const,
                id,
              })),
              { type: "HrDocument", id: "COMPANY_LIST" },
            ]
          : [{ type: "HrDocument", id: "COMPANY_LIST" }],
    }),

    getCompanyDocumentById: builder.query<APIResponse<HrDocument>, string>({
      query: (id) => `/api/v1/documents/company/${id}`,
      providesTags: (_res, _err, id) => [{ type: "HrDocument", id }],
    }),

    downloadCompanyDocument: builder.query<Blob, string>({
      query: (id) => ({
        url: `/api/v1/documents/company/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteCompanyDocument: builder.mutation<
      APIResponse<{ success: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/api/v1/documents/company/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "COMPANY_LIST" },
      ],
    }),

    // Signature & Verification Flow
    requestSignature: builder.mutation<
      APIResponse<SignatureStatusResponse>,
      RequestSignatureInput
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/documents/${id}/request-signature`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    signDocument: builder.mutation<
      APIResponse<HrDocument>,
      SignDocumentInput
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/documents/${id}/sign`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    getSignatureStatus: builder.query<
      APIResponse<SignatureStatusResponse>,
      string
    >({
      query: (id) => `/api/v1/documents/${id}/signature-status`,
      providesTags: (_res, _err, id) => [{ type: "HrDocument", id: `SIG_${id}` }],
    }),

    verifyDocument: builder.mutation<
      APIResponse<HrDocument>,
      { id: string; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `/api/v1/documents/${id}/verify`,
        method: "PATCH",
        body: { notes },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    rejectDocument: builder.mutation<
      APIResponse<HrDocument>,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/api/v1/documents/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "HrDocument", id },
        { type: "HrDocument", id: "EMPLOYEE_LIST" },
      ],
    }),

    // Expiring & Expired Documents
    getExpiringDocuments: builder.query<APIResponse<HrDocument[]>, void>({
      query: () => "/api/v1/documents/expiring",
      providesTags: [{ type: "HrDocument", id: "EXPIRING" }],
    }),

    getExpiredDocuments: builder.query<APIResponse<HrDocument[]>, void>({
      query: () => "/api/v1/documents/expired",
      providesTags: [{ type: "HrDocument", id: "EXPIRED" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useUploadEmployeeDocumentMutation,
  useGetEmployeeDocumentsQuery,
  useGetEmployeeDocumentByIdQuery,
  useLazyDownloadEmployeeDocumentQuery,
  useUpdateEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
  useUploadCompanyDocumentMutation,
  useGetCompanyDocumentsQuery,
  useGetCompanyDocumentByIdQuery,
  useLazyDownloadCompanyDocumentQuery,
  useDeleteCompanyDocumentMutation,
  useRequestSignatureMutation,
  useSignDocumentMutation,
  useGetSignatureStatusQuery,
  useVerifyDocumentMutation,
  useRejectDocumentMutation,
  useGetExpiringDocumentsQuery,
  useGetExpiredDocumentsQuery,
} = documentsApi;