import { useGetBillingSubscriptionQuery } from "@/services/api/billingApi";

export function useBillingSettings() {
  const {
    data: subscription,
    isLoading: isLoadingSub,
    error: subError,
    refetch: refetchSub,
  } = useGetBillingSubscriptionQuery();

  return { subscription, isLoadingSub, subError, refetchSub };
}
