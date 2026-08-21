import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RosterDialogForm } from "./roster/RosterDialogForm";

export function AssignRosterDialog({ isOpen, onOpenChange, rosterEmp, setRosterEmp, rosterShift, setRosterShift, rosterDay, setRosterDay, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Assign Weekly Shift Roster</DialogTitle></DialogHeader>
        <RosterDialogForm rosterEmp={rosterEmp} setRosterEmp={setRosterEmp} rosterShift={rosterShift} setRosterShift={setRosterShift} rosterDay={rosterDay} setRosterDay={setRosterDay} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Confirm Schedule</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
