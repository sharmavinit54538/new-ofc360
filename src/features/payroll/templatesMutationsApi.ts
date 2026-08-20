import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollTemplate } from "./types";
const tag = "Template";
export const templatesMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, Partial<PayrollTemplate>>({ query: (body) => ({ url: "/v2/payroll/templates", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    updatePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, { id: string; data: Partial<PayrollTemplate> }>({ query: ({ id, data }) => ({ url: `/v2/payroll/templates/${id}`, method: "PUT", body: data }), invalidatesTags: (_, __, { id }) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    duplicatePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({ query: (id) => ({ url: `/v2/payroll/templates/${id}/duplicate`, method: "POST" }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    previewPayrollTemplate: builder.mutation<APIResponse<any>, string>({ query: (id) => ({ url: `/v2/payroll/templates/${id}/preview`, method: "POST" }) }),
    publishPayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({ query: (id) => ({ url: `/v2/payroll/templates/${id}/publish`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    archivePayrollTemplate: builder.mutation<APIResponse<PayrollTemplate>, string>({ query: (id) => ({ url: `/v2/payroll/templates/${id}/archive`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useCreatePayrollTemplateMutation, useUpdatePayrollTemplateMutation, useDuplicatePayrollTemplateMutation, usePreviewPayrollTemplateMutation, usePublishPayrollTemplateMutation, useArchivePayrollTemplateMutation } = templatesMutationsApi;
