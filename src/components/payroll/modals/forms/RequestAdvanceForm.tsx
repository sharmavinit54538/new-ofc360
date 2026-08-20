import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function RequestAdvanceForm() {
  const { advEmp, setAdvEmp, advAmount, setAdvAmount, advEmi, setAdvEmi, handleCreateAdvance, isCreatingAdvance, employees } = usePayrollContext();
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Select Employee</Label><Select value={advEmp} onValueChange={setAdvEmp}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue placeholder="Select Employee..." /></SelectTrigger><SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.name || e.id}>{e.name || e.id}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-xs font-bold">Principal Loan Amount (INR)</Label><Input type="number" placeholder="e.g. 50000" value={advAmount} onChange={(e) => setAdvAmount(e.target.value)} className="text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">EMI Tenure Term</Label><Select value={advEmi} onValueChange={setAdvEmi}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="3">3 Months (Short term)</SelectItem><SelectItem value="6">6 Months (Standard)</SelectItem><SelectItem value="12">12 Months (Extended)</SelectItem></SelectContent></Select></div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={handleCreateAdvance} disabled={isCreatingAdvance} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{isCreatingAdvance && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Issue Advance</Button></div>
    </div>
  );
}
