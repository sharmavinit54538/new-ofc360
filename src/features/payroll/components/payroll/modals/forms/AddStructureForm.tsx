import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function AddStructureForm() {
  const c = usePayrollContext();
  const flds = [{ l: "Basic %", v: c.structBasic, s: c.setStructBasic }, { l: "HRA %", v: c.structHra, s: c.setStructHra }, { l: "DA %", v: c.structDa, s: c.setStructDa }];
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold">Grade Band Name</Label><Input placeholder="e.g. Senior Software Engineer" value={c.structGrade} onChange={(e) => c.setStructGrade(e.target.value)} className="text-xs h-9" /></div>
      <div className="grid grid-cols-3 gap-2">{flds.map((f) => <div key={f.l} className="space-y-1"><Label className="text-[10px] font-bold">{f.l}</Label><Input type="number" value={f.v} onChange={(e) => f.s(e.target.value)} className="text-xs h-9" /></div>)}</div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={c.handleCreateStructure} disabled={c.isCreatingStructure} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{c.isCreatingStructure && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create Grade</Button></div>
    </div>
  );
}
