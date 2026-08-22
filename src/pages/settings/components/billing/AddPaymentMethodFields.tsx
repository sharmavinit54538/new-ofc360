import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentMethodFormData } from "../../types/billingTypes";
import { AddPmExpiryFields } from "./AddPmExpiryFields";

export function AddPaymentMethodFields({ form, onChange }: { form: PaymentMethodFormData; onChange: (f: PaymentMethodFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Cardholder Name</Label><Input placeholder="Name on card" value={form.cardholderName} onChange={(e) => onChange({ ...form, cardholderName: e.target.value })} className="bg-secondary/30" required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Card Brand</Label><select value={form.brand} onChange={(e) => onChange({ ...form, brand: e.target.value })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground focus-visible:outline-none"><option value="Visa">Visa</option><option value="Mastercard">Mastercard</option><option value="RuPay">RuPay</option><option value="Amex">American Express</option></select></div>
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Last 4 Digits</Label><Input maxLength={4} placeholder="4242" value={form.last4} onChange={(e) => onChange({ ...form, last4: e.target.value.replace(/\D/g, "") })} className="bg-secondary/30 font-mono text-center tracking-wider" required /></div>
      </div>
      <AddPmExpiryFields form={form} onChange={onChange} />
    </>
  );
}