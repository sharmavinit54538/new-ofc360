import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompensationState } from "../types/compensationTypes";

export function CompensationSalaryRow({ comp }: { comp: CompensationState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Annual CTC ($ / ₹)</Label><Input type="number" value={comp.ctc} onChange={(e) => comp.setCtc(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono font-bold text-primary" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Basic Salary ($ / ₹)</Label><Input type="number" value={comp.basicSalary} onChange={(e) => comp.setBasicSalary(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">HRA Allowance ($ / ₹)</Label><Input type="number" value={comp.hra} onChange={(e) => comp.setHra(Number(e.target.value))} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono" /></div>
    </div>
  );
}
