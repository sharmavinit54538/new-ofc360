import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AddressItem } from "@/types/hr";
import { ADDRESS_TYPE_OPTIONS } from "../constants/addressTypeOptions";

export function AddressCardTopRow({ addr, onUpdate }: { addr: AddressItem; onUpdate: (a: AddressItem) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Address Type</Label><Select value={addr.type} onValueChange={(v) => onUpdate({ ...addr, type: v as AddressItem["type"] })}><SelectTrigger className="bg-secondary/30 text-xs h-9"><SelectValue /></SelectTrigger><SelectContent>{ADDRESS_TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
      <div className="sm:col-span-2 space-y-1"><Label className="text-[11px] font-semibold">Address Line 1</Label><Input value={addr.line1} onChange={(e) => onUpdate({ ...addr, line1: e.target.value })} placeholder="House / Street / Building" className="bg-secondary/30 text-xs h-9" /></div>
    </div>
  );
}
