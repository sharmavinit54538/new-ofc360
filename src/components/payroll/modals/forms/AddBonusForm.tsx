import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function AddBonusForm() {
  const { bonusEmp, setBonusEmp, bonusType, setBonusType, bonusAmount, setBonusAmount, handleCreateBonus, isCreatingBonus, employees } = usePayrollContext();
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Select Employee</Label><Select value={bonusEmp} onValueChange={setBonusEmp}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue placeholder="Select Employee..." /></SelectTrigger><SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.name || e.id}>{e.name || e.id}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Bonus Payout Category</Label><Select value={bonusType} onValueChange={setBonusType}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Performance Bonus">Performance Bonus</SelectItem><SelectItem value="Referral Reward">Referral Incentive</SelectItem><SelectItem value="Festival Award">Festival Bonus</SelectItem></SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-xs font-bold">Payout Amount (INR)</Label><Input type="number" placeholder="e.g. 15000" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} className="text-xs h-9" /></div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={handleCreateBonus} disabled={isCreatingBonus} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{isCreatingBonus && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Issue Bonus</Button></div>
    </div>
  );
}
