import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { SubmitReimbursementForm } from "./forms/SubmitReimbursementForm";

export function SubmitReimbursementModal() {
  const { isReimbModalOpen, setIsReimbModalOpen } = usePayrollContext();
  return (
    <Dialog open={isReimbModalOpen} onOpenChange={setIsReimbModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Submit Expense Reimbursement Claim</DialogTitle></DialogHeader>
        <SubmitReimbursementForm />
      </DialogContent>
    </Dialog>
  );
}
