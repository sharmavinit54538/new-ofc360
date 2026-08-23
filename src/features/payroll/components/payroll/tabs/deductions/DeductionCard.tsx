import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayrollContext } from "../../PayrollContext";

export function DeductionCard({ d }: { d: any }) {
  const { handleDeleteDeduction, isDeletingDeduction } = usePayrollContext();
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
      <div className="flex items-center justify-between"><h3 className="font-bold text-sm text-foreground">{d.name || "Provident Fund (PF)"}</h3><Button variant="ghost" size="icon" onClick={() => handleDeleteDeduction(d.id)} disabled={isDeletingDeduction} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button></div>
      <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Rule Type</span><Badge variant="outline" className="text-[10px] bg-card uppercase">{d.type || "statutory"}</Badge></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Rate Coefficient</span><span className="font-mono text-foreground font-bold">{d.value || 12}% of Basic</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Mandatory Block</span><span className="font-mono text-emerald-500 font-bold">{d.is_mandatory ? "Yes" : "No"}</span></div>
      </div>
    </div>
  );
}
