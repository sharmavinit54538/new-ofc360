import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddressItem } from "@/types/hr";

export function AddressCardInputs({ addr, onUpdate }: { addr: AddressItem; onUpdate: (a: AddressItem) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="space-y-1"><Label className="text-[11px] font-semibold">City</Label><Input value={addr.city} onChange={(e) => onUpdate({ ...addr, city: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">State</Label><Input value={addr.state} onChange={(e) => onUpdate({ ...addr, state: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Pincode</Label><Input value={addr.pincode} onChange={(e) => onUpdate({ ...addr, pincode: e.target.value })} className="bg-secondary/30 text-xs h-9 font-mono" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Country</Label><Input value={addr.country} onChange={(e) => onUpdate({ ...addr, country: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
    </div>
  );
}
