import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { KycDocumentItem } from "@/types/hr";
import { KYC_TYPE_OPTIONS } from "../constants/kycTypeOptions";

export function KycCardItem({ doc, onUpdate, onRemove }: { doc: KycDocumentItem; onUpdate: (d: KycDocumentItem) => void; onRemove: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Document Type</Label><Select value={doc.type} onValueChange={(v) => onUpdate({ ...doc, type: v as KycDocumentItem["type"] })}><SelectTrigger className="bg-secondary/30 text-xs h-9"><SelectValue /></SelectTrigger><SelectContent>{KYC_TYPE_OPTIONS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Document Number</Label><Input value={doc.documentNumber} onChange={(e) => onUpdate({ ...doc, documentNumber: e.target.value })} placeholder="e.g. ABCDE1234F" className="bg-secondary/30 text-xs h-9 font-mono" /></div>
      <div className="flex items-end gap-2"><div className="flex-1 space-y-1"><Label className="text-[11px] font-semibold">Expiry Date (Optional)</Label><Input type="date" value={doc.expiryDate || ""} onChange={(e) => onUpdate({ ...doc, expiryDate: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div><button type="button" onClick={onRemove} className="h-9 px-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></div>
    </div>
  );
}
