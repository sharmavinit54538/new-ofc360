import { Layers, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { SalaryStructureCard } from "./SalaryStructureCard";

export function SalaryStructureList() {
  const { isStructuresLoading, structuresList } = usePayrollContext();
  if (isStructuresLoading) {
    return <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-2"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /><p className="text-xs text-muted-foreground">Loading templates...</p></div>;
  }
  if (structuresList.length === 0) {
    return <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2"><Layers className="w-8 h-8 mx-auto text-muted-foreground/40" /><h4 className="font-bold text-sm text-foreground">No CTC Grade Structures Defined</h4></div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {structuresList.map((s: any) => <SalaryStructureCard key={s.id} s={s} />)}
    </div>
  );
}
