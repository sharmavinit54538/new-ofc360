import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BankAccountItem } from "@/types/hr";

export function BankAccountCardItem({ acc, onUpdate, onRemove }: { acc: BankAccountItem; onUpdate: (b: BankAccountItem) => void; onRemove: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Badge variant="outline" className="text-xs font-bold text-primary">{acc.bankName || "Bank Account"}</Badge>{acc.isPrimary && <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">Primary Payout Account</Badge>}</div><button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive text-xs"><Trash2 className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1"><Label className="text-[11px] font-semibold">Bank Name</Label><Input value={acc.bankName} onChange={(e) => onUpdate({ ...acc, bankName: e.target.value })} placeholder="e.g. HDFC Bank" className="bg-secondary/30 text-xs h-9" /></div>
        <div className="space-y-1"><Label className="text-[11px] font-semibold">Account Number</Label><Input value={acc.accountNumber} onChange={(e) => onUpdate({ ...acc, accountNumber: e.target.value })} placeholder="50100234567890" className="bg-secondary/30 text-xs h-9 font-mono" /></div>
        <div className="space-y-1"><Label className="text-[11px] font-semibold">IFSC Code</Label><Input value={acc.ifscCode} onChange={(e) => onUpdate({ ...acc, ifscCode: e.target.value })} placeholder="HDFC0001234" className="bg-secondary/30 text-xs h-9 font-mono uppercase" /></div>
      </div>
    </div>
  );
}
