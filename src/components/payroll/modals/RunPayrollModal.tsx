import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { RunPayrollForm } from "./forms/RunPayrollForm";

export function RunPayrollModal() {
  const { isRunModalOpen, setIsRunModalOpen } = usePayrollContext();
  return (
    <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Execute Salary Processing Run</DialogTitle></DialogHeader>
        <RunPayrollForm />
      </DialogContent>
    </Dialog>
  );
}
