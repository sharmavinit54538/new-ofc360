import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AddressItem } from "@/types/hr";
import { AddressCardTopRow } from "./AddressCardTopRow";
import { AddressCardInputs } from "./AddressCardInputs";

export function AddressCardItem({ addr, idx, onUpdate, onRemove }: {
  addr: AddressItem; idx: number; onUpdate: (a: AddressItem) => void; onRemove: () => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs font-bold text-primary">Address #{idx + 1} ({addr.type})</Badge>
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive text-xs"><Trash2 className="w-4 h-4" /></button>
      </div>
      <AddressCardTopRow addr={addr} onUpdate={onUpdate} />
      <AddressCardInputs addr={addr} onUpdate={onUpdate} />
    </div>
  );
}
