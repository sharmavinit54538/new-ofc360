import { baseApi } from "../baseApi";

export const billingPaymentDefaultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deletePaymentMethod: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({ url: `/api/v1/billing/payment-methods/${id}`, method: "DELETE" }),
      invalidatesTags: ["BillingSettings"],
    }),
    setDefaultPaymentMethod: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({ url: `/api/v1/billing/payment-methods/${id}/default`, method: "POST" }),
      invalidatesTags: ["BillingSettings"],
    }),
  }),
});
export const { useDeletePaymentMethodMutation, useSetDefaultPaymentMethodMutation } = billingPaymentDefaultApi;
