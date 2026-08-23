import { api as baseApi } from "@/api/client";
import { unwrapEnvelope } from "@/services/api/envelope";

export const billingDownloadInvoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadInvoice: builder.query<{ downloadUrl: string }, string>({
      query: (invoiceId) => `/api/v1/billing/invoices/${invoiceId}/download`,
      transformResponse: (response: any) => ({ downloadUrl: unwrapEnvelope(response)?.downloadUrl || "" }),
    }),
  }),
});
export const { useDownloadInvoiceQuery, useLazyDownloadInvoiceQuery } = billingDownloadInvoiceApi;
