import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeaveDialogForm } from "./leave/LeaveDialogForm";

export function ApplyLeaveDialog({ isOpen, onOpenChange, leaveType, setLeaveType, leaveStart, setLeaveStart, leaveEnd, setLeaveEnd, leaveReason, setLeaveReason, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Apply for Leave / Time-Off</DialogTitle></DialogHeader>
        <LeaveDialogForm leaveType={leaveType} setLeaveType={setLeaveType} leaveStart={leaveStart} setLeaveStart={setLeaveStart} leaveEnd={leaveEnd} setLeaveEnd={setLeaveEnd} leaveReason={leaveReason} setLeaveReason={setLeaveReason} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Submit Application</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
