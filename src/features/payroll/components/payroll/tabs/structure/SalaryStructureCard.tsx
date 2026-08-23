import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function SalaryStructureCard({ s }: { s: any }) {
  const { handleDeleteStructure, isDeletingStructure, fmt } = usePayrollContext();
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
      <div className="flex items-center justify-between"><h3 className="font-bold text-sm text-foreground">{s.name || "Senior Engineer Grade"}</h3><Button variant="ghost" size="icon" onClick={() => handleDeleteStructure(s.id)} disabled={isDeletingStructure} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button></div>
      <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Basic Salary</span><span className="font-mono font-bold text-foreground">{s.basicPct || 50}% CTC</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">HRA</span><span className="font-mono text-foreground">{s.hraPct || 20}% CTC</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Special Allowance</span><span className="font-mono text-foreground">{s.specialAllowancePct || 20}% CTC</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Base Payout</span><span className="font-mono text-primary font-bold">{fmt(s.base_salary || 100000)}</span></div>
      </div>
    </div>
  );
}
