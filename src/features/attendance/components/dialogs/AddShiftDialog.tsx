import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShiftDialogInputs } from "./shift/ShiftDialogInputs";
import { ShiftDialogSelects } from "./shift/ShiftDialogSelects";

export function AddShiftDialog({ isOpen, onOpenChange, shiftName, setShiftName, shiftStart, setShiftStart, shiftEnd, setShiftEnd, shiftDept, setShiftDept, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Create New Shift Pattern</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <ShiftDialogInputs shiftName={shiftName} setShiftName={setShiftName} shiftStart={shiftStart} setShiftStart={setShiftStart} shiftEnd={shiftEnd} setShiftEnd={setShiftEnd} />
          <ShiftDialogSelects shiftDept={shiftDept} setShiftDept={setShiftDept} />
        </div>
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Save Shift</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
