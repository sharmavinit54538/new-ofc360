import { Layers, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { DeductionCard } from "./DeductionCard";

export function DeductionsList() {
  const { isDeductionsLoading, deductionsList } = usePayrollContext();
  if (isDeductionsLoading) {
    return <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-2"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /><p className="text-xs text-muted-foreground">Loading rules...</p></div>;
  }
  if (deductionsList.length === 0) {
    return <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2"><Layers className="w-8 h-8 mx-auto text-muted-foreground/40" /><h4 className="font-bold text-sm text-foreground">No Deduction Rules Created</h4></div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {deductionsList.map((d: any) => <DeductionCard key={d.id} d={d} />)}
    </div>
  );
}
