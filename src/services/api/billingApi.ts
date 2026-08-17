import { baseApi } from "./baseApi";
import { RawEnvelope, unwrapEnvelope } from "./envelope";
import {
  BillingSubscription,
  PaymentMethod,
  AddPaymentMethodRequest,
  BillingInvoice,
  InvoicesResponse,
} from "@/types/api/settings";

export function normalizeSubscription(data: any): BillingSubscription {
  if (!data) {
    return {
      plan: "Community Tier",
      billingCycle: "Monthly",
      price: 0,
      currency: "INR",
      status: "inactive",
      seats: 0,
      usedSeats: 0,
    };
  }

  const raw = (data as RawEnvelope<any>)?.data || data;

  const rawPrice =
    raw.price ??
    raw.amount ??
    raw.cost ??
    raw.monthly_price ??
    raw.monthlyPrice ??
    0;

  const rawSeats =
    raw.seats ??
    raw.totalSeats ??
    raw.total_seats ??
    raw.seat_limit ??
    raw.seatLimit ??
    raw.max_employees ??
    raw.maxEmployees ??
    0;

  const rawUsedSeats =
    raw.usedSeats ??
    raw.used_seats ??
    raw.active_employees ??
    raw.activeEmployees ??
    raw.current_seats ??
    raw.currentSeats ??
    0;

  return {
    id: raw.id || raw.subscription_id,
    plan: raw.plan || raw.planName || raw.plan_name || raw.tier || "Community Tier",
    planName: raw.planName || raw.plan_name || raw.plan,
    billingCycle: raw.billingCycle || raw.billing_cycle || (raw.interval === "year" ? "Annual" : "Monthly"),
    price: typeof rawPrice === "string" ? parseFloat(rawPrice) || 0 : Number(rawPrice),
    currency: raw.currency || "INR",
    status: raw.status || (raw.active ? "active" : "inactive"),
    seats: Number(rawSeats),
    usedSeats: Number(rawUsedSeats),
    currentPeriodStart: raw.currentPeriodStart || raw.current_period_start || raw.start_date,
    currentPeriodEnd: raw.currentPeriodEnd || raw.current_period_end || raw.end_date,
    renewalDate:
      raw.renewalDate ||
      raw.renewal_date ||
      raw.nextBillingDate ||
      raw.next_billing_date ||
      raw.next_invoice_date,
    nextBillingDate:
      raw.nextBillingDate ||
      raw.next_billing_date ||
      raw.renewalDate ||
      raw.renewal_date,
    features: raw.features || [],
    limits: raw.limits || {
      maxEmployees: raw.max_employees || raw.maxEmployees,
      storageGb: raw.storage_gb || raw.storageGb,
      aiCreditsMonthly: raw.ai_credits_monthly || raw.aiCreditsMonthly,
    },
  };
}

export function normalizePaymentMethod(item: any): PaymentMethod {
  if (!item) return {} as PaymentMethod;
  return {
    id: String(item.id || item.payment_method_id || item.pm_id || `pm_${Math.random().toString(36).slice(2)}`),
    type: item.type || item.payment_type || "card",
    brand: item.brand || item.card_brand || item.card_type || item.network || "Card",
    last4: String(item.last4 || item.last_4 || item.card_last4 || item.card_last_4 || "0000"),
    expMonth: Number(item.expMonth || item.exp_month || item.expiry_month || 12),
    expYear: Number(item.expYear || item.exp_year || item.expiry_year || 2030),
    isDefault: Boolean(item.isDefault ?? item.is_default ?? item.default ?? false),
    cardholderName: item.cardholderName || item.cardholder_name || item.name || item.billing_name || "",
    createdAt: item.createdAt || item.created_at,
  };
}

export function normalizeInvoice(item: any): BillingInvoice {
  if (!item) return {} as BillingInvoice;
  const rawAmount = item.amount ?? item.total ?? item.subtotal ?? 0;
  return {
    id: String(item.id || item.invoice_id || item.number || `inv_${Math.random().toString(36).slice(2)}`),
    invoiceNumber:
      item.invoiceNumber ||
      item.invoice_number ||
      item.number ||
      item.code ||
      `INV-${item.id || Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    amount: typeof rawAmount === "string" ? parseFloat(rawAmount) || 0 : Number(rawAmount),
    currency: item.currency || "INR",
    status: item.status || "paid",
    issueDate: item.issueDate || item.issue_date || item.date || item.created_at || item.createdAt,
    date: item.date || item.issueDate || item.issue_date || item.created_at || item.createdAt,
    dueDate: item.dueDate || item.due_date,
    periodStart: item.periodStart || item.period_start,
    periodEnd: item.periodEnd || item.period_end,
    downloadUrl: item.downloadUrl || item.download_url || item.pdfUrl || item.pdf_url || item.invoice_pdf || item.hosted_invoice_url,
    pdfUrl: item.pdfUrl || item.pdf_url || item.downloadUrl || item.download_url,
    receiptUrl: item.receiptUrl || item.receipt_url,
  };
}

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<BillingSubscription, void>({
      query: () => "/api/v1/billing/subscription",
      transformResponse: (response: any) => normalizeSubscription(response),
      providesTags: ["BillingSettings"],
    }),

    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => "/api/v1/billing/payment-methods",
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response);
        let list: any[] = [];
        if (Array.isArray(raw)) list = raw;
        else if (raw && Array.isArray(raw.payment_methods)) list = raw.payment_methods;
        else if (raw && Array.isArray(raw.paymentMethods)) list = raw.paymentMethods;
        else if (raw && Array.isArray(raw.cards)) list = raw.cards;
        return list.map(normalizePaymentMethod);
      },
      providesTags: ["BillingSettings"],
    }),

    addPaymentMethod: builder.mutation<PaymentMethod, AddPaymentMethodRequest>({
      query: (body) => {
        const payload = {
          payment_method_id: body.paymentMethodId || body.payment_method_id || body.token,
          paymentMethodId: body.paymentMethodId || body.payment_method_id || body.token,
          token: body.token || body.paymentMethodId,
          brand: body.brand,
          last4: body.last4,
          exp_month: body.expMonth ?? body.exp_month,
          expMonth: body.expMonth ?? body.exp_month,
          exp_year: body.expYear ?? body.exp_year,
          expYear: body.expYear ?? body.exp_year,
          cardholder_name: body.cardholderName || body.cardholder_name,
          cardholderName: body.cardholderName || body.cardholder_name,
          is_default: body.isDefault ?? body.is_default ?? true,
          isDefault: body.isDefault ?? body.is_default ?? true,
          type: body.type || "card",
        };
        return {
          url: "/api/v1/billing/payment-methods",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: any) => normalizePaymentMethod(unwrapEnvelope(response)),
      invalidatesTags: ["BillingSettings"],
    }),

    deletePaymentMethod: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/billing/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BillingSettings"],
    }),

    setDefaultPaymentMethod: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/billing/payment-methods/${id}/default`,
        method: "POST",
      }),
      invalidatesTags: ["BillingSettings"],
    }),

    getInvoices: builder.query<
      InvoicesResponse,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.page) sp.append("page", String(params.page));
        if (params?.limit) sp.append("limit", String(params.limit));
        if (params?.status) sp.append("status", params.status);
        const q = sp.toString();
        return `/api/v1/billing/invoices${q ? `?${q}` : ""}`;
      },
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response);
        let list: any[] = [];
        let total = 0;
        let page = 1;
        let limit = 10;
        let totalPages = 1;

        if (Array.isArray(raw)) {
          list = raw;
          total = raw.length;
        } else if (raw && typeof raw === "object") {
          list = raw.invoices || raw.data || raw.items || [];
          total = raw.total || raw.total_count || list.length;
          page = raw.page || raw.current_page || 1;
          limit = raw.limit || raw.per_page || 10;
          totalPages = raw.totalPages || raw.total_pages || Math.ceil(total / limit) || 1;
        }

        return {
          invoices: list.map(normalizeInvoice),
          total,
          page,
          limit,
          totalPages,
        };
      },
      providesTags: ["BillingSettings"],
    }),

    downloadInvoice: builder.query<{ downloadUrl: string }, string>({
      query: (invoiceId) => `/api/v1/billing/invoices/${invoiceId}/download`,
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response);
        return {
          downloadUrl: raw?.downloadUrl || raw?.download_url || raw?.url || "",
        };
      },
    }),
  }),
});

export const {
  useGetSubscriptionQuery: useGetBillingSubscriptionQuery,
  useLazyGetSubscriptionQuery: useLazyGetBillingSubscriptionQuery,
  useGetPaymentMethodsQuery,
  useLazyGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetInvoicesQuery: useGetBillingInvoicesQuery,
  useLazyGetInvoicesQuery: useLazyGetBillingInvoicesQuery,
  useDownloadInvoiceQuery,
  useLazyDownloadInvoiceQuery,
} = billingApi;
