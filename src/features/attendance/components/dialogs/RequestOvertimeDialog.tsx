import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OvertimeDialogForm } from "./overtime/OvertimeDialogForm";

export function RequestOvertimeDialog({ isOpen, onOpenChange, otHours, setOtHours, otMultiplier, setOtMultiplier, otReason, setOtReason, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Request Overtime (OT) Approval</DialogTitle></DialogHeader>
        <OvertimeDialogForm otHours={otHours} setOtHours={setOtHours} otMultiplier={otMultiplier} setOtMultiplier={setOtMultiplier} otReason={otReason} setOtReason={setOtReason} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Submit OT Request</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
