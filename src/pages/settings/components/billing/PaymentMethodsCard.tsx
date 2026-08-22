import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types/api/settings";
import { PaymentMethodItem } from "./PaymentMethodItem";
import { PaymentMethodsEmpty } from "./PaymentMethodsEmpty";

export function PaymentMethodsCard({ paymentMethods, isLoading, onOpenAdd, onSetDefault, onDelete, onRefresh }: {
  paymentMethods: PaymentMethod[]; isLoading: boolean; onOpenAdd: () => void; onSetDefault: (id: string) => void; onDelete: (id: string) => void; onRefresh: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm md:col-span-2 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between"><div><h3 className="text-base font-bold text-foreground">Payment Methods</h3><p className="text-xs text-muted-foreground">Manage authorized cards and corporate billing instruments.</p></div><Button size="sm" variant="outline" onClick={onOpenAdd} className="text-xs gap-1 h-8 bg-secondary/40 border-border/60 hover:bg-secondary"><Plus className="w-3.5 h-3.5" /> Add Payment Method</Button></div>
        {isLoading ? <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div> : paymentMethods.length === 0 ? <PaymentMethodsEmpty /> : <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">{paymentMethods.map((pm) => <PaymentMethodItem key={pm.id} pm={pm} onSetDefault={onSetDefault} onDelete={onDelete} />)}</div>}
      </div>
      <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/30"><span>Billing Status: Active</span><span className="text-primary cursor-pointer hover:underline text-xs" onClick={onRefresh}>Refresh Payment Methods</span></div>
    </div>
  );
}
