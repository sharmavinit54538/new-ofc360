import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Payslip, PaginationQueryParams } from "../types";
export const payslipsQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayslips: builder.query<APIResponse<any>, PaginationQueryParams | void>({
      query: (p) => ({ url: "/v2/payroll/payslips", params: p || undefined }),
      providesTags: (r) => { const list = Array.isArray(r?.data) ? r.data : r?.data?.items || r?.data?.payslips || []; return list.length ? [...list.map(({ id }) => ({ type: "Payslip" as const, id })), { type: "Payslip", id: "LIST" }] : [{ type: "Payslip", id: "LIST" }]; }
    }),
    getPayslipById: builder.query<APIResponse<Payslip>, string>({ query: (id) => `/v2/payroll/payslips/${id}`, providesTags: (_, __, id) => [{ type: "Payslip", id }] }),
    previewPayslip: builder.query<APIResponse<any>, string>({ query: (id) => `/v2/payroll/payslips/${id}/preview`, providesTags: (_, __, id) => [{ type: "Payslip", id: `PREVIEW_${id}` }] }),
    getPayslipAuditLogs: builder.query<APIResponse<any[]>, string>({ query: (id) => `/v2/payroll/payslips/${id}/audit-logs`, providesTags: (_, __, id) => [{ type: "Payslip", id: `AUDIT_${id}` }] }),
    bulkDownloadPayslips: builder.query<Blob, any>({ query: (p) => ({ url: "/v2/payroll/payslips/bulk-download", method: "POST", body: p || {} }), responseHandler: (r) => r.blob() }),
    downloadPayslipPdf: builder.query<Blob, string>({ query: (id) => ({ url: `/v2/payroll/payslips/${id}/pdf`, responseHandler: (r) => r.blob() }) }),
  }),
});
export const { useGetPayslipsQuery, useGetPayslipByIdQuery, usePreviewPayslipQuery, useGetPayslipAuditLogsQuery, useBulkDownloadPayslipsQuery, useLazyBulkDownloadPayslipsQuery, useDownloadPayslipPdfQuery, useLazyDownloadPayslipPdfQuery } = payslipsQueriesApi;
