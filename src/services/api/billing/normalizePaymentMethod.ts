import { PaymentMethod } from "@/types/api/settings";

export function normalizePaymentMethod(item: any): PaymentMethod {
  if (!item) return {} as PaymentMethod;
  return {
    id: String(item.id || item.payment_method_id || item.pm_id || `pm_${Math.random().toString(36).slice(2)}`),
    type: item.type || item.payment_type || "card",
    brand: item.brand || item.card_brand || item.card_type || item.network || "Card",
    last4: String(item.last4 || item.last_4 || item.card_last4 || item.card_last_4 || "0000"),
    expMonth: Number(item.expMonth || item.exp_month || item.expiry_month || 12),
    expYear: Number(item.expYear || item.exp_year || item.expiry_year || 2030),
    isDefault: Boolean(item.isDefault ?? item.is_default ?? item.default ?? false),
    cardholderName: item.cardholderName || item.cardholder_name || item.name || item.billing_name || "",
    createdAt: item.createdAt || item.created_at,
  };
}
