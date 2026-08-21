import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OvertimeDialogForm } from "./overtime/OvertimeDialogForm";

export function RequestOvertimeDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  otHours: string; setOtHours: (v: string) => void;
  otMultiplier: string; setOtMultiplier: (v: string) => void;
  otReason: string; setOtReason: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Request Overtime (OT) Approval</DialogTitle></DialogHeader>
        <OvertimeDialogForm otHours={p.otHours} setOtHours={p.setOtHours} otMultiplier={p.otMultiplier} setOtMultiplier={p.setOtMultiplier} otReason={p.otReason} setOtReason={p.setOtReason} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Submit OT Request</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
