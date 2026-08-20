import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function AddDeductionForm() {
  const { dedName, setDedName, dedType, setDedType, dedPct, setDedPct, handleCreateDeduction, isCreatingDeduction } = usePayrollContext();
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Deduction Rule Title</Label><Input placeholder="e.g. Employee Provident Fund (EPF)" value={dedName} onChange={(e) => setDedName(e.target.value)} className="text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Deduction Class</Label><Select value={dedType} onValueChange={setDedType}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PF (Provident Fund)">EPF Provident Fund</SelectItem><SelectItem value="ESI (Employee Insurance)">ESIC Health Insurance</SelectItem><SelectItem value="Professional Tax">Professional Tax (PT)</SelectItem></SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-xs font-bold">Deduction Coefficient (% of Basic)</Label><Input type="number" value={dedPct} onChange={(e) => setDedPct(e.target.value)} className="text-xs h-9" /></div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={handleCreateDeduction} disabled={isCreatingDeduction} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{isCreatingDeduction && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Rule</Button></div>
    </div>
  );
}
