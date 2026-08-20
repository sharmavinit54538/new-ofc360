import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function SubmitReimbursementForm() {
  const { reimbCategory, setReimbCategory, reimbAmount, setReimbAmount, reimbDesc, setReimbDesc, handleCreateReimbursement, isCreatingReimb } = usePayrollContext();
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Expense Category</Label><Select value={reimbCategory} onValueChange={setReimbCategory}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Fuel & Travel">Fuel & Travel Allowance</SelectItem><SelectItem value="Internet & Device">Internet & Device Reimbursement</SelectItem><SelectItem value="Medical Claim">Statutory Medical Claim</SelectItem></SelectContent></Select></div>
      <div className="space-y-1"><Label className="text-xs font-bold">Claim Amount (INR)</Label><Input type="number" placeholder="e.g. 3500" value={reimbAmount} onChange={(e) => setReimbAmount(e.target.value)} className="text-xs h-9" /></div>
      <div className="space-y-1"><Label className="text-xs font-bold">Description / Remarks</Label><Input placeholder="Reason for reimbursement claim" value={reimbDesc} onChange={(e) => setReimbDesc(e.target.value)} className="text-xs h-9" /></div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={handleCreateReimbursement} disabled={isCreatingReimb} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{isCreatingReimb && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Submit Claim</Button></div>
    </div>
  );
}
