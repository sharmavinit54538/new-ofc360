import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function SalaryStructureHeader() {
  const { setIsStructModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Salary Structures & Grade CTC Builder</h2>
        <p className="text-xs text-muted-foreground">Define Basic, HRA, DA, and Special Allowance percentages for employee grades.</p>
      </div>
      <Button onClick={() => setIsStructModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Add Grade Band Structure
      </Button>
    </div>
  );
}
