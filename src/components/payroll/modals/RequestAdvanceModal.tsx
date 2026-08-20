import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { RequestAdvanceForm } from "./forms/RequestAdvanceForm";

export function RequestAdvanceModal() {
  const { isAdvModalOpen, setIsAdvModalOpen } = usePayrollContext();
  return (
    <Dialog open={isAdvModalOpen} onOpenChange={setIsAdvModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Request Salary Advance Loan</DialogTitle></DialogHeader>
        <RequestAdvanceForm />
      </DialogContent>
    </Dialog>
  );
}
