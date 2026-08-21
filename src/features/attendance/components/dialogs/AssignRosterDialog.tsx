import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RosterDialogForm } from "./roster/RosterDialogForm";

export function AssignRosterDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  rosterEmp: string; setRosterEmp: (v: string) => void;
  rosterShift: string; setRosterShift: (v: string) => void;
  rosterDay: string; setRosterDay: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Assign Weekly Shift Roster</DialogTitle></DialogHeader>
        <RosterDialogForm rosterEmp={p.rosterEmp} setRosterEmp={p.setRosterEmp} rosterShift={p.rosterShift} setRosterShift={p.setRosterShift} rosterDay={p.rosterDay} setRosterDay={p.setRosterDay} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Confirm Schedule</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
