import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TimesheetDialogForm } from "./timesheet/TimesheetDialogForm";

export function LogTimesheetDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  tsProject: string; setTsProject: (v: string) => void;
  tsHours: string; setTsHours: (v: string) => void;
  tsBillable: boolean; setTsBillable: (v: boolean) => void;
  tsTask: string; setTsTask: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Log Daily Task Timesheet</DialogTitle></DialogHeader>
        <TimesheetDialogForm tsProject={p.tsProject} setTsProject={p.setTsProject} tsTask={p.tsTask} setTsTask={p.setTsTask} tsHours={p.tsHours} setTsHours={p.setTsHours} tsBillable={p.tsBillable} setTsBillable={p.setTsBillable} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Log Timesheet</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
