import { CreditCard } from "lucide-react";

export function PaymentMethodsEmpty() {
  return (
    <div className="p-6 rounded-xl bg-secondary/20 border border-dashed border-border/60 flex flex-col items-center justify-center text-center space-y-2">
      <CreditCard className="w-8 h-8 text-muted-foreground/60" />
      <p className="text-xs font-semibold text-foreground">No payment method on file</p>
      <p className="text-[11px] text-muted-foreground max-w-sm">Add a corporate card, bank mandate, or credit card to enable automatic subscription billing.</p>
    </div>
  );
}
