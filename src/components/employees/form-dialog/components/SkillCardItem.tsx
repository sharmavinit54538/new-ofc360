import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SkillItem } from "@/types/hr";
import { SKILL_PROFICIENCY_OPTIONS } from "../constants/skillProficiencyOptions";

export function SkillCardItem({ skill, onUpdate, onRemove }: { skill: SkillItem; onUpdate: (s: SkillItem) => void; onRemove: () => void }) {
  return (
    <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-center gap-2">
      <Input placeholder="e.g. React, Node.js" value={skill.name} onChange={(e) => onUpdate({ ...skill, name: e.target.value })} className="bg-secondary/40 text-xs h-9 flex-1" />
      <Select value={skill.proficiency} onValueChange={(v) => onUpdate({ ...skill, proficiency: v as SkillItem["proficiency"] })}><SelectTrigger className="w-28 bg-secondary/40 text-xs h-9"><SelectValue /></SelectTrigger><SelectContent>{SKILL_PROFICIENCY_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
      <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive px-1"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}
