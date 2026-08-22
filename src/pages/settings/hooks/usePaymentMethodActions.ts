import { toast } from "sonner";
import { useAddPaymentMethodMutation, useDeletePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from "@/services/api/billingApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { usePaymentMethodsList } from "./usePaymentMethodsList";

export function usePaymentMethodActions(list: ReturnType<typeof usePaymentMethodsList>) {
  const [addPaymentMethod, { isLoading: isAddingPM }] = useAddPaymentMethodMutation();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLast4 = list.pmForm.last4.replace(/\D/g, "").slice(-4);
    if (cleanLast4.length !== 4) return toast.error("Please enter the last 4 digits of your card.");
    if (!list.pmForm.cardholderName.trim()) return toast.error("Please enter cardholder name.");
    try {
      await addPaymentMethod({ ...list.pmForm, last4: cleanLast4, expMonth: Number(list.pmForm.expMonth), expYear: Number(list.pmForm.expYear), cardholderName: list.pmForm.cardholderName.trim() }).unwrap();
      toast.success("Payment method added securely!");
      list.setIsAddPmOpen(false);
      list.setPmForm({ cardholderName: "", brand: "Visa", last4: "", expMonth: 12, expYear: 2028, isDefault: true });
    } catch (err: any) { toast.error(normalizeError(err).message || "Failed to add payment method."); }
  };

  const handleDeletePM = async (id: string) => {
    try { await deletePaymentMethod(id).unwrap(); toast.success("Payment method removed."); } catch (err: any) { toast.error(normalizeError(err).message || "Failed to delete payment method."); }
  };

  const handleSetDefaultPM = async (id: string) => {
    try { await setDefaultPaymentMethod(id).unwrap(); toast.success("Primary payment method updated."); } catch (err: any) { toast.error(normalizeError(err).message || "Failed to set default payment method."); }
  };

  return { isAddingPM, handleAddPaymentMethod, handleDeletePM, handleSetDefaultPM };
}
