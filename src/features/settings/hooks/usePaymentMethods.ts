import { usePaymentMethodsList } from "./usePaymentMethodsList";
import { usePaymentMethodActions } from "./usePaymentMethodActions";

export function usePaymentMethods() {
  const list = usePaymentMethodsList();
  const actions = usePaymentMethodActions(list);
  return { ...list, ...actions };
}
