import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollTemplate, PaginationQueryParams } from "./types";

export const templatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollTemplates: builder.query<APIResponse<PayrollTemplate[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/templates",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Template" as const, id })),
              { type: "Template", id: "LIST" },
            ]
          : [{ type: "Template", id: "LIST" }],
    }),

    getPayrollTemplatesAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/templates/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Template", id: "AUDIT" }],
    }),

    getPayrollTemplatesHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/templates/history",
        method: "GET",
      }),
      providesTags: [{ type: "Template", id: "HISTORY" }],
    }),

    getPayrollTemplateById: builder.query<APIResponse<PayrollTemplate>, string>({
      query: (templateId) => ({
        url: `/v2/payroll/templates/${templateId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, templateId) => [{ type: "Template", id: templateId }],
    }),

    createPayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, Partial<PayrollTemplate>>({
      query: (body) => ({
        url: "/v2/payroll/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),

    updatePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, { id: string; data: Partial<PayrollTemplate> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/templates/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Template", id },
        { type: "Template", id: "LIST" },
      ],
    }),

    duplicatePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({
      query: (templateId) => ({
        url: `/v2/payroll/templates/${templateId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),

    previewPayrollTemplate: builder.mutation<APIResponse<Record<string, any>>, string>({
      query: (templateId) => ({
        url: `/v2/payroll/templates/${templateId}/preview`,
        method: "POST",
      }),
    }),

    publishPayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({
      query: (templateId) => ({
        url: `/v2/payroll/templates/${templateId}/publish`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, templateId) => [
        { type: "Template", id: templateId },
        { type: "Template", id: "LIST" },
      ],
    }),

    archivePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({
      query: (templateId) => ({
        url: `/v2/payroll/templates/${templateId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, templateId) => [
        { type: "Template", id: templateId },
        { type: "Template", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollTemplatesQuery,
  useGetPayrollTemplatesAuditQuery,
  useGetPayrollTemplatesHistoryQuery,
  useGetPayrollTemplateByIdQuery,
  useCreatePayrollTemplateMutation,
  useUpdatePayrollTemplateMutation,
  useDuplicatePayrollTemplateMutation,
  usePreviewPayrollTemplateMutation,
  usePublishPayrollTemplateMutation,
  useArchivePayrollTemplateMutation,
} = templatesApi;