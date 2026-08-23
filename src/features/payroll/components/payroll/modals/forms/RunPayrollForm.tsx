import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function RunPayrollForm() {
  const { runMonth, setRunMonth, handleRunPayroll, isRunningPayroll } = usePayrollContext();
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1.5"><Label className="text-xs font-bold text-foreground">Target Billing Cycle Month</Label><Input placeholder="e.g. June 2026" value={runMonth} onChange={(e) => setRunMonth(e.target.value)} className="text-xs h-9 bg-card" /></div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
        <Button onClick={handleRunPayroll} disabled={isRunningPayroll} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{isRunningPayroll && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Run Calculation Pipeline</Button>
      </div>
    </div>
  );
}
