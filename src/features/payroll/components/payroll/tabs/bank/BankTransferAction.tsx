import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function BankTransferAction({ b }: { b: any }) {
  const c = usePayrollContext();
  return (
    <Button size="sm" variant="outline" onClick={() => c.handleDownloadBankAdvice(b)} className="h-7 text-xs gap-1 border-border/60">
      <Download className="w-3 h-3" /> CSV
    </Button>
  );
}
