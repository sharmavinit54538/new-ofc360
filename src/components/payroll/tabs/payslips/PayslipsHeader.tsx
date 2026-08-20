import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function PayslipsHeader() {
  const { handleBulkEmailPayslips, isEmailingPayslips } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Digital Payslips Repository</h2>
        <p className="text-xs text-muted-foreground">Password-protected PDF payslips generated per employee.</p>
      </div>
      <Button onClick={handleBulkEmailPayslips} disabled={isEmailingPayslips} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        {isEmailingPayslips ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Bulk Email Payslips
      </Button>
    </div>
  );
}
