import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegularizationDialogForm } from "./regularization/RegularizationDialogForm";

export function ApplyRegularizationDialog({ isOpen, onOpenChange, regDate, setRegDate, regType, setRegType, regTime, setRegTime, regReason, setRegReason, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Apply Attendance Regularization</DialogTitle></DialogHeader>
        <RegularizationDialogForm regDate={regDate} setRegDate={setRegDate} regType={regType} setRegType={setRegType} regTime={regTime} setRegTime={setRegTime} regReason={regReason} setRegReason={setRegReason} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Submit for Approval</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
