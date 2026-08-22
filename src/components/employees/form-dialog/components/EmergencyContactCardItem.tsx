import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmergencyContactItem } from "@/types/hr";
import { EMERGENCY_RELATIONSHIP_OPTIONS } from "../constants/emergencyRelationshipOptions";

export function EmergencyContactCardItem({ contact, onUpdate, onRemove }: {
  contact: EmergencyContactItem; onUpdate: (c: EmergencyContactItem) => void; onRemove: () => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Contact Person Name</Label><Input value={contact.name} onChange={(e) => onUpdate({ ...contact, name: e.target.value })} placeholder="Full Name" className="bg-secondary/30 text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Relationship</Label><Select value={contact.relationship} onValueChange={(v) => onUpdate({ ...contact, relationship: v as EmergencyContactItem["relationship"] })}><SelectTrigger className="bg-secondary/30 text-xs h-9"><SelectValue /></SelectTrigger><SelectContent>{EMERGENCY_RELATIONSHIP_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
      <div className="flex items-end gap-2"><div className="flex-1 space-y-1"><Label className="text-[11px] font-semibold">Primary Phone Number</Label><Input value={contact.primaryPhone} onChange={(e) => onUpdate({ ...contact, primaryPhone: e.target.value })} placeholder="+91 9876543210" className="bg-secondary/30 text-xs h-9 font-mono" /></div><button type="button" onClick={onRemove} className="h-9 px-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></div>
    </div>
  );
}
