import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function ReimbursementsHeader() {
  const { setIsReimbModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Expense Claims & Tax-Free Reimbursements</h2>
        <p className="text-xs text-muted-foreground">Review fuel, internet, and travel claims for non-taxable payout.</p>
      </div>
      <Button onClick={() => setIsReimbModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Submit Expense Claim
      </Button>
    </div>
  );
}
