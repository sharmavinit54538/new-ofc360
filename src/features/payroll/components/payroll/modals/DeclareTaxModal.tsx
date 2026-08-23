import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePayrollContext } from "../PayrollContext";
import { DeclareTaxForm } from "./forms/DeclareTaxForm";

export function DeclareTaxModal() {
  const { isTaxModalOpen, setIsTaxModalOpen } = usePayrollContext();
  return (
    <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border/60">
        <DialogHeader><DialogTitle className="text-lg font-bold text-foreground">Declare Income Tax Investments</DialogTitle></DialogHeader>
        <DeclareTaxForm />
      </DialogContent>
    </Dialog>
  );
}
