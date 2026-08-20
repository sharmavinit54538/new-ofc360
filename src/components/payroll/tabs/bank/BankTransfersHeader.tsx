import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function BankTransfersHeader() {
  const { handleGenerateBankAdvice, isGeneratingTransferFile } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Corporate Payout Advice Batches</h2>
        <p className="text-xs text-muted-foreground">Generate automated bank payment advice instruction files for salary upload portals.</p>
      </div>
      <Button onClick={handleGenerateBankAdvice} disabled={isGeneratingTransferFile} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        {isGeneratingTransferFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Generate Bank Advice
      </Button>
    </div>
  );
}
