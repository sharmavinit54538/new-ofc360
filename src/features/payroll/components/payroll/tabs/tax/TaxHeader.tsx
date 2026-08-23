import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function TaxHeader() {
  const { setIsTaxModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Income Tax (IT) Declarations & TDS Compliance</h2>
        <p className="text-xs text-muted-foreground">Select Old vs New Tax Regime, declare Section 80C/80D investments, and preview monthly TDS deduction.</p>
      </div>
      <Button onClick={() => setIsTaxModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Declare IT Investments
      </Button>
    </div>
  );
}
