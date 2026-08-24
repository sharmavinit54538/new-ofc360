import { api as baseApi } from "@/api/client";
import {
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  RazorpayVerifyRequest,
  RazorpayVerifyResponse,
} from "@/types/api/settings/razorpayTypes";

export const billingRazorpayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation<RazorpayOrderResponse, RazorpayOrderRequest>({
      query: (body) => ({
        url: "/api/v1/billing/razorpay/create-order",
        method: "POST",
        body: {
          plan: body.plan,
          billing_cycle: body.billingCycle,
          seats: body.seats,
          amount: body.amount,
          currency: body.currency || "INR",
        },
      }),
      transformResponse: (response: any): RazorpayOrderResponse => {
        const data = response?.data || response;
        return {
          id: data?.id || data?.orderId || data?.order_id || `order_${Date.now()}`,
          orderId: data?.orderId || data?.order_id || data?.id || `order_${Date.now()}`,
          amount: Number(data?.amount || 0),
          currency: data?.currency || "INR",
          keyId: data?.keyId || data?.key_id || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_OFC360Demo",
          name: data?.name || "OFC360 Enterprise",
          description: data?.description || `Plan Upgrade - ${data?.plan || "Growth"}`,
        };
      },
    }),

    verifyRazorpayPayment: builder.mutation<RazorpayVerifyResponse, RazorpayVerifyRequest>({
      query: (body) => ({
        url: "/api/v1/billing/razorpay/verify",
        method: "POST",
        body: {
          razorpay_order_id: body.razorpay_order_id,
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_signature: body.razorpay_signature,
          plan: body.plan,
          billing_cycle: body.billingCycle,
          seats: body.seats,
        },
      }),
      transformResponse: (response: any): RazorpayVerifyResponse => {
        const data = response?.data || response;
        return {
          success: data?.success !== false,
          message: data?.message || "Payment verified & subscription activated successfully!",
          paymentId: data?.paymentId || data?.payment_id,
          orderId: data?.orderId || data?.order_id,
          subscription: data?.subscription,
        };
      },
      invalidatesTags: ["BillingSettings", "Settings", "Billing"],
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = billingRazorpayApi;
