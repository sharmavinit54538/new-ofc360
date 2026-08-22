import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PaymentMethodFormData } from "../../types/billingTypes";

export function AddPaymentMethodFields({ form, onChange }: { form: PaymentMethodFormData; onChange: (f: PaymentMethodFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Cardholder Name</Label><Input placeholder="Name on card" value={form.cardholderName} onChange={(e) => onChange({ ...form, cardholderName: e.target.value })} className="bg-secondary/30" required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Card Brand</Label><select value={form.brand} onChange={(e) => onChange({ ...form, brand: e.target.value })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground focus-visible:outline-none"><option value="Visa">Visa</option><option value="Mastercard">Mastercard</option><option value="RuPay">RuPay</option><option value="Amex">American Express</option></select></div>
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Last 4 Digits</Label><Input maxLength={4} placeholder="4242" value={form.last4} onChange={(e) => onChange({ ...form, last4: e.target.value.replace(/\D/g, "") })} className="bg-secondary/30 font-mono text-center tracking-wider" required /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Expiry Month</Label><select value={form.expMonth} onChange={(e) => onChange({ ...form, expMonth: Number(e.target.value) })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground">{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}</select></div>
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Expiry Year</Label><select value={form.expYear} onChange={(e) => onChange({ ...form, expYear: Number(e.target.value) })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground">{Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30"><div className="space-y-0.5"><p className="text-xs font-semibold text-foreground">Set as Primary</p><p className="text-[11px] text-muted-foreground">Charge automatically for renewal.</p></div><Switch checked={form.isDefault} onCheckedChange={(c) => onChange({ ...form, isDefault: c })} /></div>
    </>
  );
}
