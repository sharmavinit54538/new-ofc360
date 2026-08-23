import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { AddBonusForm } from "./forms/AddBonusForm";

export function AddBonusModal() {
  const { isBonusModalOpen, setIsBonusModalOpen } = usePayrollContext();
  return (
    <Dialog open={isBonusModalOpen} onOpenChange={setIsBonusModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Create Bonus Entry</DialogTitle></DialogHeader>
        <AddBonusForm />
      </DialogContent>
    </Dialog>
  );
}
