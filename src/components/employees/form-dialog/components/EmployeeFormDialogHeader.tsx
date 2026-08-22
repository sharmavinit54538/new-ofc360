import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Employee } from "@/types/hr";

export function EmployeeFormDialogHeader({ employee }: { employee: Employee | null }) {
  return (
    <DialogHeader className="p-4 sm:p-5 border-b border-border/40 bg-secondary/20">
      <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
        {employee ? `Edit Employee — ${employee.name}` : "Add New Employee / System User"}
      </DialogTitle>
    </DialogHeader>
  );
}
