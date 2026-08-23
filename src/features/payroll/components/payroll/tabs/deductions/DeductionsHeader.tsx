import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function DeductionsHeader() {
  const { setIsDedModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Statutory Deductions & Social Security Rules</h2>
        <p className="text-xs text-muted-foreground">Manage PF, Professional Tax (PT), and voluntary deductions policy coefficients.</p>
      </div>
      <Button onClick={() => setIsDedModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Add Deduction Rule
      </Button>
    </div>
  );
}
