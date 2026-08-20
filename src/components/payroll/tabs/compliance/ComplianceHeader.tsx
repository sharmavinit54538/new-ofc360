import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function ComplianceHeader() {
  const { handleGenerateEpfoEcr, isGeneratingChallan } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Statutory Labor Law & Tax Compliance</h2>
        <p className="text-xs text-muted-foreground">Monitor state & central compliance policies (EPF, ESI, LWF, Prof Tax).</p>
      </div>
      <Button onClick={handleGenerateEpfoEcr} disabled={isGeneratingChallan} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        {isGeneratingChallan ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />} Generate EPFO ECR Challan
      </Button>
    </div>
  );
}
