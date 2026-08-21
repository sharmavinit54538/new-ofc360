import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HolidayDialogForm } from "./holiday/HolidayDialogForm";

export function AddHolidayDialog({ isOpen, onOpenChange, holidayTitle, setHolidayTitle, holidayDate, setHolidayDate, holidayType, setHolidayType, holidayBranch, setHolidayBranch, onSubmit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Declare Official Holiday</DialogTitle></DialogHeader>
        <HolidayDialogForm holidayTitle={holidayTitle} setHolidayTitle={setHolidayTitle} holidayDate={holidayDate} setHolidayDate={setHolidayDate} holidayType={holidayType} setHolidayType={setHolidayType} holidayBranch={holidayBranch} setHolidayBranch={setHolidayBranch} />
        <DialogFooter><Button onClick={onSubmit} size="sm" className="text-xs">Publish Holiday</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
