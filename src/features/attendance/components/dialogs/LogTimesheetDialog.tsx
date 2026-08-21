import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TimesheetDialogForm } from "./timesheet/TimesheetDialogForm";

export function LogTimesheetDialog({ isOpen, onOpenChange, tsProject, setTsProject, tsTask, setTsTask, tsHours, setTsHours, tsBillable, setTsBillable, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Log Daily Task Timesheet</DialogTitle></DialogHeader>
        <TimesheetDialogForm tsProject={tsProject} setTsProject={setTsProject} tsTask={tsTask} setTsTask={setTsTask} tsHours={tsHours} setTsHours={setTsHours} tsBillable={tsBillable} setTsBillable={setTsBillable} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Log Timesheet</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
