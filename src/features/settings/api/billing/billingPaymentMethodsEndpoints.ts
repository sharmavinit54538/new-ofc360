import { api as baseApi } from "@/api/client";
import { unwrapEnvelope } from "@/services/api/envelope";
import { PaymentMethod, AddPaymentMethodRequest } from "@/types/api/settings";
import { normalizePaymentMethod } from "./normalizePaymentMethod";

export const billingPaymentMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => "/api/v1/billing/payment-methods",
      transformResponse: (r: any) => {
        const raw = unwrapEnvelope(r);
        const list = Array.isArray(raw) ? raw : raw?.payment_methods || [];
        // Filter out dummy/mock cards that were previously seeded
        const realList = list.filter((item: any) => {
          if (!item) return false;
          const last4 = String(item.last4 || item.last_4 || "");
          if (last4 === "1007" && !item.user_id && !item.created_at) return false;
          return true;
        });
        return realList.map(normalizePaymentMethod);
      },
      providesTags: ["BillingSettings"],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, AddPaymentMethodRequest>({
      query: (b) => ({
        url: "/api/v1/billing/payment-methods",
        method: "POST",
        body: { ...b, payment_method_id: b.paymentMethodId || b.token },
      }),
      transformResponse: (r: any) => normalizePaymentMethod(unwrapEnvelope(r)),
      invalidatesTags: ["BillingSettings"],
    }),
  }),
});

export const { useGetPaymentMethodsQuery, useLazyGetPaymentMethodsQuery, useAddPaymentMethodMutation } = billingPaymentMethodsApi;
