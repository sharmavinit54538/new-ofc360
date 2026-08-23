import { toast } from "sonner";
import { useDeletePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from "@/services/api/billingApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { usePaymentMethodsList } from "./usePaymentMethodsList";
import { useAddPaymentMethod } from "./useAddPaymentMethod";

export function usePaymentMethodActions(list: ReturnType<typeof usePaymentMethodsList>) {
  const { isAddingPM, handleAddPaymentMethod } = useAddPaymentMethod(list);
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();

  const handleDeletePM = async (id: string) => {
    try { await deletePaymentMethod(id).unwrap(); toast.success("Payment method removed."); } catch (err: any) { toast.error(normalizeError(err).message || "Failed to delete."); }
  };
  const handleSetDefaultPM = async (id: string) => {
    try { await setDefaultPaymentMethod(id).unwrap(); toast.success("Primary payment method updated."); } catch (err: any) { toast.error(normalizeError(err).message || "Failed to set default."); }
  };
  return { isAddingPM, handleAddPaymentMethod, handleDeletePM, handleSetDefaultPM };
}