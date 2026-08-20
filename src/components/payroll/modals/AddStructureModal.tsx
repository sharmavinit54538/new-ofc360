import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { AddStructureForm } from "./forms/AddStructureForm";

export function AddStructureModal() {
  const { isStructModalOpen, setIsStructModalOpen } = usePayrollContext();
  return (
    <Dialog open={isStructModalOpen} onOpenChange={setIsStructModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Create Salary CTC Grade Structure</DialogTitle></DialogHeader>
        <AddStructureForm />
      </DialogContent>
    </Dialog>
  );
}
