import { api as baseApi } from "@/api/client";
import { unwrapEnvelope } from "@/services/api/envelope";
import { InvoicesResponse } from "@/types/api/settings";
import { normalizeInvoice } from "./normalizeInvoice";

export const billingInvoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoicesResponse, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.page) sp.append("page", String(params.page));
        if (params?.limit) sp.append("limit", String(params.limit));
        if (params?.status) sp.append("status", params.status);
        const q = sp.toString();
        return `/api/v1/payments/history${q ? `?${q}` : ""}`;
      },
      transformResponse: (r: any) => {
        const raw = unwrapEnvelope(r);
        const list = Array.isArray(raw) ? raw : raw?.items || raw?.invoices || raw?.transactions || [];
        const realList = list.filter((item: any) => {
          if (!item) return false;
          const invNum = String(item.invoice_number || item.invoiceNumber || item.number || "");
          const amount = Number(item.amount ?? item.total ?? 0);
          if ((invNum === "INV-2026-001" || invNum === "INV-2025-012") && amount === 599988 && !item.razorpay_payment_id) {
            return false;
          }
          return true;
        });
        return {
          invoices: realList.map(normalizeInvoice),
          total: realList.length,
          page: raw?.page || 1,
          limit: raw?.limit || 10,
          totalPages: Math.ceil((realList.length || 1) / (raw?.limit || 10)) || 1,
        };
      },

      providesTags: ["BillingSettings", "Settings"],
    }),
  }),
});
export const { useGetInvoicesQuery: useGetBillingInvoicesQuery, useLazyGetInvoicesQuery: useLazyGetBillingInvoicesQuery } = billingInvoicesApi;

