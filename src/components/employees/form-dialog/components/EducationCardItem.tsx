import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EducationItem } from "@/types/hr";

export function EducationCardItem({ edu, onUpdate, onRemove }: { edu: EducationItem; onUpdate: (e: EducationItem) => void; onRemove: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Degree / Qualification</Label><Input value={edu.degree} onChange={(e) => onUpdate({ ...edu, degree: e.target.value })} placeholder="B.Tech, MBA, etc." className="bg-secondary/30 text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Institution / University</Label><Input value={edu.institution} onChange={(e) => onUpdate({ ...edu, institution: e.target.value })} placeholder="e.g. Delhi University" className="bg-secondary/30 text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-[11px] font-semibold">Grade / Score</Label><Input value={edu.grade || ""} onChange={(e) => onUpdate({ ...edu, grade: e.target.value })} placeholder="8.5 CGPA" className="bg-secondary/30 text-xs h-9" /></div>
      <div className="flex items-end gap-2"><div className="flex-1 space-y-1"><Label className="text-[11px] font-semibold">End Year</Label><Input value={edu.endYear || ""} onChange={(e) => onUpdate({ ...edu, endYear: e.target.value })} placeholder="2022" className="bg-secondary/30 text-xs h-9 font-mono" /></div><button type="button" onClick={onRemove} className="h-9 px-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></div>
    </div>
  );
}
