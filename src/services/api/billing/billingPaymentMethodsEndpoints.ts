import { baseApi } from "../baseApi";
import { unwrapEnvelope } from "../envelope";
import { PaymentMethod, AddPaymentMethodRequest } from "@/types/api/settings";
import { normalizePaymentMethod } from "./normalizePaymentMethod";

export const billingPaymentMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => "/api/v1/billing/payment-methods",
      transformResponse: (r: any) => { const raw = unwrapEnvelope(r); return (Array.isArray(raw) ? raw : raw?.payment_methods || []).map(normalizePaymentMethod); },
      providesTags: ["BillingSettings"],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, AddPaymentMethodRequest>({
      query: (b) => ({ url: "/api/v1/billing/payment-methods", method: "POST", body: { ...b, payment_method_id: b.paymentMethodId || b.token } }),
      transformResponse: (r: any) => normalizePaymentMethod(unwrapEnvelope(r)),
      invalidatesTags: ["BillingSettings"],
    }),
  }),
});
export const { useGetPaymentMethodsQuery, useLazyGetPaymentMethodsQuery, useAddPaymentMethodMutation } = billingPaymentMethodsApi;
