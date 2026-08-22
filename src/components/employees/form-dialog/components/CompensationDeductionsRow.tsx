import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompensationState } from "../types/compensationTypes";

export function CompensationDeductionsRow({ comp }: { comp: CompensationState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Bonus / Perks</Label><Input type="number" value={comp.bonus} onChange={(e) => comp.setBonus(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">PF Deduction</Label><Input type="number" value={comp.pfDeduction} onChange={(e) => comp.setPfDeduction(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">ESI Deduction</Label><Input type="number" value={comp.esiDeduction} onChange={(e) => comp.setEsiDeduction(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Professional Tax</Label><Input type="number" value={comp.profTax} onChange={(e) => comp.setProfTax(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive" /></div>
    </div>
  );
}
