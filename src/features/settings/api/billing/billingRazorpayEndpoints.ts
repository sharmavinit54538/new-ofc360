import { api as baseApi } from "@/api/client";
import {
  PaymentPlanItem,
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  RazorpayVerifyRequest,
  RazorpayVerifyResponse,
  PaymentTransactionHistoryItem,
} from "@/types/api/settings/razorpayTypes";

export const billingRazorpayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentPlans: builder.query<PaymentPlanItem[], void>({
      query: () => "/api/v1/payments/plans",
      transformResponse: (response: any): PaymentPlanItem[] => {
        const list = response?.data || response?.items || response || [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["BillingSettings", "Settings"],
    }),

    createRazorpayOrder: builder.mutation<RazorpayOrderResponse, RazorpayOrderRequest>({
      query: (body) => ({
        url: "/api/v1/payments/create-order",
        method: "POST",
        body: {
          plan_id: body.plan_id.toLowerCase(),
          billing_cycle: body.billing_cycle.toLowerCase(),
          ...(body.seats ? { seats: body.seats } : {}),
        },
      }),
      transformResponse: (response: any): RazorpayOrderResponse => {
        const data = response?.data || response;
        return {
          order_id: String(data?.order_id || data?.orderId || data?.id || `order_${Date.now()}`),
          orderId: String(data?.order_id || data?.orderId || data?.id || `order_${Date.now()}`),
          amount: Number(data?.amount || 0),
          currency: String(data?.currency || "INR"),
          key_id: String(data?.key_id || data?.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_OFC360Demo"),
          keyId: String(data?.key_id || data?.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_OFC360Demo"),
          plan_id: String(data?.plan_id || "growth"),
          plan_name: String(data?.plan_name || "Growth Plan"),
          billing_cycle: String(data?.billing_cycle || "monthly"),
          name: "OFC360 Enterprise",
          description: `Subscription Upgrade - ${data?.plan_name || data?.plan_id || "Growth"}`,
        };
      },
    }),

    verifyRazorpayPayment: builder.mutation<RazorpayVerifyResponse, RazorpayVerifyRequest>({
      query: (body) => ({
        url: "/api/v1/payments/verify",
        method: "POST",
        body: {
          razorpay_order_id: body.razorpay_order_id,
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_signature: body.razorpay_signature,
        },
      }),
      transformResponse: (response: any): RazorpayVerifyResponse => {
        const data = response?.data || response;
        return {
          success: response?.success !== false && data?.status !== "FAILED",
          message: response?.message || "Payment verified and subscription activated successfully.",
          transaction_id: data?.transaction_id || data?.id,
          order_id: data?.order_id,
          payment_id: data?.payment_id,
          status: data?.status || "CAPTURED",
          plan_id: data?.plan_id,
          plan_name: data?.plan_name,
          amount: data?.amount,
          currency: data?.currency || "INR",
          subscription: data?.subscription || {
            plan: data?.plan_name || data?.plan_id || "Growth",
            billingCycle: data?.billing_cycle || "monthly",
            price: data?.amount || 0,
            currency: data?.currency || "INR",
            status: "active",
            seats: data?.seats || 50,
          },
        };
      },
      invalidatesTags: ["BillingSettings", "Settings", "Billing"],
    }),

    getPaymentHistory: builder.query<PaymentTransactionHistoryItem[], { page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        const qs = queryParams.toString();
        return `/api/v1/payments/history${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: any): PaymentTransactionHistoryItem[] => {
        const list = response?.data?.items || response?.data || response?.items || response || [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["BillingSettings", "Settings"],
    }),

    getPaymentDetail: builder.query<PaymentTransactionHistoryItem, string>({
      query: (paymentId) => `/api/v1/payments/${paymentId}`,
      transformResponse: (response: any): PaymentTransactionHistoryItem => {
        return response?.data || response;
      },
      providesTags: ["BillingSettings"],
    }),
  }),
});

export const {
  useGetPaymentPlansQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentDetailQuery,
} = billingRazorpayApi;
