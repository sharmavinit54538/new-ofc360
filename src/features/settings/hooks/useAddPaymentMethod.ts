import { toast } from "sonner";
import { useAddPaymentMethodMutation } from "@/features/settings/api/billingApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { usePaymentMethodsList } from "./usePaymentMethodsList";

export function useAddPaymentMethod(list: ReturnType<typeof usePaymentMethodsList>) {
  const [addPaymentMethod, { isLoading: isAddingPM }] = useAddPaymentMethodMutation();
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLast4 = list.pmForm.last4.replace(/\D/g, "").slice(-4);
    if (cleanLast4.length !== 4) return toast.error("Enter last 4 card digits.");
    if (!list.pmForm.cardholderName.trim()) return toast.error("Enter cardholder name.");
    try {
      await addPaymentMethod({ ...list.pmForm, last4: cleanLast4, expMonth: Number(list.pmForm.expMonth), expYear: Number(list.pmForm.expYear), cardholderName: list.pmForm.cardholderName.trim() }).unwrap();
      toast.success("Payment method added!"); list.setIsAddPmOpen(false); list.setPmForm({ cardholderName: "", brand: "Visa", last4: "", expMonth: 12, expYear: 2028, isDefault: true });
    } catch (err: any) { toast.error(normalizeError(err).message || "Failed to add payment method."); }
  };
  return { isAddingPM, handleAddPaymentMethod };
}