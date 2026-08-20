import { useExportSalaryProcessingMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollExportLedger() {
  const [exportSalaryProcessing, { isLoading: isExportingReport }] = useExportSalaryProcessingMutation();
  const handleExportAccountingLedger = async () => {
    try {
      await exportSalaryProcessing({ type: "accounting_ledger", format: "csv" }).unwrap();
      toast.success("Exported Accounting Ledger for Tally / QuickBooks from backend.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to export financial ledger.");
    }
  };
  return { handleExportAccountingLedger, isExportingReport };
}
