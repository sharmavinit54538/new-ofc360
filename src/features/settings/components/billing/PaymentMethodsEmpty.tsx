import { CreditCard, ShieldCheck } from "lucide-react";

export function PaymentMethodsEmpty() {
  return (
    <div className="p-6 rounded-xl bg-secondary/20 border border-dashed border-border/60 flex flex-col items-center justify-center text-center space-y-2">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <CreditCard className="w-5 h-5" />
      </div>
      <p className="text-xs font-bold text-foreground">No saved cards on file</p>
      <p className="text-[11px] text-muted-foreground max-w-sm">
        Payments are processed securely via <strong>Razorpay</strong> during plan upgrade with support for UPI (GPay/PhonePe), Credit/Debit Cards, and NetBanking.
      </p>
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5" /> Razorpay 256-Bit SSL Gateway Ready
      </div>
    </div>
  );
}

