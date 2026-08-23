import { api as baseApi } from "@/api/client";
import { BillingSubscription } from "@/types/api/settings";
import { normalizeSubscription } from "./normalizeSubscription";

export const billingSubscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<BillingSubscription, void>({
      query: () => "/api/v1/billing/subscription",
      transformResponse: (response: any) => normalizeSubscription(response),
      providesTags: ["BillingSettings"],
    }),
  }),
});
export const {
  useGetSubscriptionQuery: useGetBillingSubscriptionQuery,
  useLazyGetSubscriptionQuery: useLazyGetBillingSubscriptionQuery,
} = billingSubscriptionApi;
