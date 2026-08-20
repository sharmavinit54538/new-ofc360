import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function ReportsHeader() {
  const { handleExportAccountingLedger, isExportingReport } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Financial Ledger Reports & Reconciliation</h2>
        <p className="text-xs text-muted-foreground">Export consolidated monthly salary expenses for journal entries in ERP accounts.</p>
      </div>
      <Button onClick={handleExportAccountingLedger} disabled={isExportingReport} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        {isExportingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />} Export Accounting Ledger
      </Button>
    </div>
  );
}
