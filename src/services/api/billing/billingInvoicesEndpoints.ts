import { baseApi } from "../baseApi";
import { unwrapEnvelope } from "../envelope";
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
        return `/api/v1/billing/invoices${q ? `?${q}` : ""}`;
      },
      transformResponse: (r: any) => {
        const raw = unwrapEnvelope(r);
        const list = Array.isArray(raw) ? raw : raw?.invoices || raw?.items || [];
        return { invoices: list.map(normalizeInvoice), total: raw?.total || list.length, page: raw?.page || 1, limit: raw?.limit || 10, totalPages: raw?.totalPages || 1 };
      },
      providesTags: ["BillingSettings"],
    }),
  }),
});
export const { useGetInvoicesQuery: useGetBillingInvoicesQuery, useLazyGetInvoicesQuery: useLazyGetBillingInvoicesQuery } = billingInvoicesApi;
