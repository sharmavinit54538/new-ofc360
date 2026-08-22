import { useState } from "react";
import { useGetPaymentMethodsQuery } from "@/services/api/billingApi";
import type { PaymentMethodFormData } from "../types/billingTypes";

export function usePaymentMethodsList() {
  const { data: paymentMethods = [], isLoading: isLoadingPM, refetch: refetchPM } = useGetPaymentMethodsQuery();
  const [isAddPmOpen, setIsAddPmOpen] = useState(false);
  const [pmForm, setPmForm] = useState<PaymentMethodFormData>({ cardholderName: "", brand: "Visa", last4: "", expMonth: 12, expYear: 2028, isDefault: true });

  return { paymentMethods, isLoadingPM, refetchPM, isAddPmOpen, setIsAddPmOpen, pmForm, setPmForm };
}
