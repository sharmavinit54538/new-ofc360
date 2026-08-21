import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShiftDialogInputs } from "./shift/ShiftDialogInputs";
import { ShiftDialogSelects } from "./shift/ShiftDialogSelects";

export function AddShiftDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void; shiftName: string; setShiftName: (v: string) => void;
  shiftStart: string; setShiftStart: (v: string) => void; shiftEnd: string; setShiftEnd: (v: string) => void;
  shiftGrace: string; setShiftGrace: (v: string) => void; shiftDept: string; setShiftDept: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Create New Shift Pattern</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2"><ShiftDialogInputs shiftName={p.shiftName} setShiftName={p.setShiftName} shiftStart={p.shiftStart} setShiftStart={p.setShiftStart} shiftEnd={p.shiftEnd} setShiftEnd={p.setShiftEnd} /><ShiftDialogSelects shiftDept={p.shiftDept} setShiftDept={p.setShiftDept} /></div>
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Save Shift</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
