import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeaveDialogForm } from "./leave/LeaveDialogForm";

export function ApplyLeaveDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  leaveType: string; setLeaveType: (v: string) => void;
  leaveStart: string; setLeaveStart: (v: string) => void;
  leaveEnd: string; setLeaveEnd: (v: string) => void;
  leaveReason: string; setLeaveReason: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Apply for Leave / Time-Off</DialogTitle></DialogHeader>
        <LeaveDialogForm leaveType={p.leaveType} setLeaveType={p.setLeaveType} leaveStart={p.leaveStart} setLeaveStart={p.setLeaveStart} leaveEnd={p.leaveEnd} setLeaveEnd={p.setLeaveEnd} leaveReason={p.leaveReason} setLeaveReason={p.setLeaveReason} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Submit Application</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
