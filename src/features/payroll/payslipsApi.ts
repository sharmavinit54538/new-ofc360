import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Payslip, PaginationQueryParams } from "./types";

export const payslipsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayslips: builder.query<
      APIResponse<{ items?: Payslip[]; payslips?: Payslip[]; total?: number; [key: string]: any } | Payslip[]>,
      PaginationQueryParams | void
    >({
      query: (params) => ({
        url: "/v2/payroll/payslips",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : result?.data?.items || result?.data?.payslips || [];
        return list.length
          ? [
              ...list.map(({ id }) => ({ type: "Payslip" as const, id })),
              { type: "Payslip", id: "LIST" },
            ]
          : [{ type: "Payslip", id: "LIST" }];
      },
    }),

    getPayslipById: builder.query<APIResponse<Payslip>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, payslipId) => [{ type: "Payslip", id: payslipId }],
    }),

    previewPayslip: builder.query<APIResponse<Record<string, any>>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}/preview`,
        method: "GET",
      }),
      providesTags: (_result, _error, payslipId) => [{ type: "Payslip", id: `PREVIEW_${payslipId}` }],
    }),

    getPayslipAuditLogs: builder.query<APIResponse<any[]>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}/audit-logs`,
        method: "GET",
      }),
      providesTags: (_result, _error, payslipId) => [{ type: "Payslip", id: `AUDIT_${payslipId}` }],
    }),

    bulkGeneratePayslips: builder.mutation<APIResponse<any>, { cycle_id?: string; employee_ids?: string[]; [key: string]: any }>({
      query: (body) => ({
        url: "/v2/payroll/payslips/bulk-generate",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Payslip", id: "LIST" },
        { type: "SalaryProcessing", id: "LIST" },
      ],
    }),

    bulkEmailPayslips: builder.mutation<APIResponse<any>, { payslip_ids?: string[]; [key: string]: any }>({
      query: (body) => ({
        url: "/v2/payroll/payslips/bulk-email",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Payslip", id: "LIST" }],
    }),

    // Bulk download returns ZIP binary blob
    bulkDownloadPayslips: builder.query<Blob, { payslip_ids?: string[]; cycle_id?: string; [key: string]: any } | void>({
      query: (params) => ({
        url: "/v2/payroll/payslips/bulk-download",
        method: "POST",
        body: params || {},
        responseHandler: (response) => response.blob(),
      }),
    }),

    // PDF download returns PDF binary blob
    downloadPayslipPdf: builder.query<Blob, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}/pdf`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    emailPayslip: builder.mutation<APIResponse<any>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}/email`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, payslipId) => [{ type: "Payslip", id: payslipId }],
    }),

    regeneratePayslip: builder.mutation<APIResponse<Payslip>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}/regenerate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, payslipId) => [
        { type: "Payslip", id: payslipId },
        { type: "Payslip", id: "LIST" },
        { type: "SalaryProcessing", id: "LIST" },
        { type: "SalaryProcessing", id: "HERO" },
        { type: "SalaryProcessing", id: "KPIS" },
      ],
    }),

    deletePayslip: builder.mutation<APIResponse<void>, string>({
      query: (payslipId) => ({
        url: `/v2/payroll/payslips/${payslipId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, payslipId) => [
        { type: "Payslip", id: payslipId },
        { type: "Payslip", id: "LIST" },
        { type: "SalaryProcessing", id: "LIST" },
        { type: "SalaryProcessing", id: "HERO" },
        { type: "SalaryProcessing", id: "KPIS" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  usePreviewPayslipQuery,
  useGetPayslipAuditLogsQuery,
  useBulkGeneratePayslipsMutation,
  useBulkEmailPayslipsMutation,
  useBulkDownloadPayslipsQuery,
  useLazyBulkDownloadPayslipsQuery,
  useDownloadPayslipPdfQuery,
  useLazyDownloadPayslipPdfQuery,
  useEmailPayslipMutation,
  useRegeneratePayslipMutation,
  useDeletePayslipMutation,
} = payslipsApi;