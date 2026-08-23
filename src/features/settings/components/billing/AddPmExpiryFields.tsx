import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PaymentMethodFormData } from "../../types/billingTypes";

export function AddPmExpiryFields({ form, onChange }: { form: PaymentMethodFormData; onChange: (f: PaymentMethodFormData) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Expiry Month</Label><select value={form.expMonth} onChange={(e) => onChange({ ...form, expMonth: Number(e.target.value) })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground">{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}</select></div>
        <div className="space-y-1.5"><Label className="text-xs font-semibold">Expiry Year</Label><select value={form.expYear} onChange={(e) => onChange({ ...form, expYear: Number(e.target.value) })} className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-input text-xs text-foreground">{Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30"><div className="space-y-0.5"><p className="text-xs font-semibold text-foreground">Set as Primary</p><p className="text-[11px] text-muted-foreground">Charge automatically for renewal.</p></div><Switch checked={form.isDefault} onCheckedChange={(c) => onChange({ ...form, isDefault: c })} /></div>
    </>
  );
}