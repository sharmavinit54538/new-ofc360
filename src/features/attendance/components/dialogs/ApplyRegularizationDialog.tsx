import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegularizationDialogForm } from "./regularization/RegularizationDialogForm";
import type { RegularizationRequest } from "../../../types/attendance.types";

export function ApplyRegularizationDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  regDate: string; setRegDate: (v: string) => void;
  regType: RegularizationRequest["missedPunchType"]; setRegType: (v: RegularizationRequest["missedPunchType"]) => void;
  regTime: string; setRegTime: (v: string) => void;
  regReason: string; setRegReason: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Apply Attendance Regularization</DialogTitle></DialogHeader>
        <RegularizationDialogForm regDate={p.regDate} setRegDate={p.setRegDate} regType={p.regType} setRegType={p.setRegType} regTime={p.regTime} setRegTime={p.setRegTime} regReason={p.regReason} setRegReason={p.setRegReason} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Submit for Approval</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
