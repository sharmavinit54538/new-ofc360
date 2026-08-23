import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function SalaryProcessingHeader() {
  const { setIsRunModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Monthly Salary Processing Engine</h2>
        <p className="text-xs text-muted-foreground">1-Click gross-to-net calculation with attendance LOP sync.</p>
      </div>
      <Button onClick={() => setIsRunModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Play className="w-4 h-4" /> Run Payroll Wizard
      </Button>
    </div>
  );
}
