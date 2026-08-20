import { baseApi } from "@/services/api/baseApi";
import { APIResponse, BankTransfer, PaginationQueryParams } from "../types";
export const bankQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankTransfers: builder.query<APIResponse<BankTransfer[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/bank-transfers", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "BankTransfer" as const, id })), { type: "BankTransfer", id: "LIST" }] : [{ type: "BankTransfer", id: "LIST" }] }),
    getBankTransfersDashboard: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/bank-transfers/dashboard", providesTags: [{ type: "BankTransfer", id: "DASHBOARD" }] }),
    getBankTransfersAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/bank-transfers/audit", providesTags: [{ type: "BankTransfer", id: "AUDIT" }] }),
    getBankTransferById: builder.query<APIResponse<BankTransfer>, string>({ query: (id) => `/v2/payroll/bank-transfers/${id}`, providesTags: (_, __, id) => [{ type: "BankTransfer", id }] }),
  }),
});
export const { useGetBankTransfersQuery, useGetBankTransfersDashboardQuery, useGetBankTransfersAuditQuery, useGetBankTransferByIdQuery } = bankQueriesApi;
