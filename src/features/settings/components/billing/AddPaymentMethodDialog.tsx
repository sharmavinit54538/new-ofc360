import { CreditCard, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { PaymentMethodFormData } from "../../types/billingTypes";
import { AddPaymentMethodFields } from "./AddPaymentMethodFields";

export function AddPaymentMethodDialog({ open, onOpenChange, form, onChange, isAdding, onSubmit }: {
  open: boolean; onOpenChange: (o: boolean) => void; form: PaymentMethodFormData; onChange: (f: PaymentMethodFormData) => void; isAdding: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader><DialogTitle className="text-base font-bold text-foreground flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /><span>Add Corporate Payment Method</span></DialogTitle><DialogDescription className="text-xs text-muted-foreground">Authorize a corporate credit or debit card for subscription billing.</DialogDescription></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-2"><AddPaymentMethodFields form={form} onChange={onChange} /><DialogFooter className="gap-2 sm:gap-0 pt-2"><Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">Cancel</Button><Button type="submit" size="sm" disabled={isAdding} className="gradient-bg text-primary-foreground font-semibold text-xs gap-1.5">{isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Payment Method</Button></DialogFooter></form>
      </DialogContent>
    </Dialog>
  );
}