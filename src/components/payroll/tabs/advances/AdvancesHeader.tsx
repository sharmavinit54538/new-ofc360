import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function AdvancesHeader() {
  const { setIsAdvModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Salary Advances & Loan Repayments</h2>
        <p className="text-xs text-muted-foreground">Monitor advance disbursements and monthly EMI deduction cycles.</p>
      </div>
      <Button onClick={() => setIsAdvModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Request Salary Advance
      </Button>
    </div>
  );
}
