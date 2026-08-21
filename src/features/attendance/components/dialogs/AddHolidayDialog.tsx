import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HolidayDialogForm } from "./holiday/HolidayDialogForm";
import type { HolidayItem } from "../../../types/attendance.types";

export function AddHolidayDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  holidayTitle: string; setHolidayTitle: (v: string) => void;
  holidayDate: string; setHolidayDate: (v: string) => void;
  holidayType: HolidayItem["type"]; setHolidayType: (v: HolidayItem["type"]) => void;
  holidayBranch: string; setHolidayBranch: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Declare Official Holiday</DialogTitle></DialogHeader>
        <HolidayDialogForm holidayTitle={p.holidayTitle} setHolidayTitle={p.setHolidayTitle} holidayDate={p.holidayDate} setHolidayDate={p.setHolidayDate} holidayType={p.holidayType} setHolidayType={p.setHolidayType} holidayBranch={p.holidayBranch} setHolidayBranch={p.setHolidayBranch} />
        <DialogFooter><Button onClick={p.onSubmit} size="sm" className="text-xs">Publish Holiday</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
