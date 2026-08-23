import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types/api/settings";

export function PaymentMethodItem({ pm, onSetDefault, onDelete }: { pm: PaymentMethod; onSetDefault: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-border transition-colors text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-6 rounded bg-card border border-border/60 flex items-center justify-center font-bold text-[10px] text-foreground tracking-wider uppercase">{pm.brand || "Card"}</div>
        <div><p className="font-semibold text-foreground">•••• •••• •••• {pm.last4}</p><p className="text-[11px] text-muted-foreground">Expires {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}{pm.cardholderName ? ` • ${pm.cardholderName}` : ""}</p></div>
      </div>
      <div className="flex items-center gap-2">
        {pm.isDefault ? <Badge className="text-[10px] bg-primary/15 text-primary border-primary/20">Default</Badge> : <Button variant="ghost" size="sm" onClick={() => onSetDefault(pm.id)} className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground">Make Default</Button>}
        <Button variant="ghost" size="icon" onClick={() => onDelete(pm.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Remove payment method"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    </div>
  );
}
