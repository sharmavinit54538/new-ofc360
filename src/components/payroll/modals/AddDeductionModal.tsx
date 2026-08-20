import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { AddDeductionForm } from "./forms/AddDeductionForm";

export function AddDeductionModal() {
  const { isDedModalOpen, setIsDedModalOpen } = usePayrollContext();
  return (
    <Dialog open={isDedModalOpen} onOpenChange={setIsDedModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Create Statutory Deduction Rule</DialogTitle></DialogHeader>
        <AddDeductionForm />
      </DialogContent>
    </Dialog>
  );
}
