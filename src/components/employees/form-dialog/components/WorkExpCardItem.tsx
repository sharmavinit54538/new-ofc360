import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkExperienceItem } from "@/types/hr";

export function WorkExpCardItem({ exp, onUpdate, onRemove }: { exp: WorkExperienceItem; onUpdate: (e: WorkExperienceItem) => void; onRemove: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
      <div className="flex justify-between items-center"><span className="text-xs font-bold text-foreground">{exp.companyName || "Previous Employer"}</span><button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1"><Label className="text-[11px] font-semibold">Company Name</Label><Input value={exp.companyName} onChange={(e) => onUpdate({ ...exp, companyName: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
        <div className="space-y-1"><Label className="text-[11px] font-semibold">Designation</Label><Input value={exp.designation} onChange={(e) => onUpdate({ ...exp, designation: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
        <div className="space-y-1"><Label className="text-[11px] font-semibold">Start Date</Label><Input type="date" value={exp.startDate} onChange={(e) => onUpdate({ ...exp, startDate: e.target.value })} className="bg-secondary/30 text-xs h-9" /></div>
      </div>
    </div>
  );
}
