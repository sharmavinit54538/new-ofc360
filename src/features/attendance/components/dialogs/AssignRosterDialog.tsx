import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SHIFT_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
} from "../../constants/attendance.constants";

interface AssignRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rosterEmp: string;
  onRosterEmpChange: (val: string) => void;
  rosterShift: string;
  onRosterShiftChange: (val: string) => void;
  rosterDay: string;
  onRosterDayChange: (val: string) => void;
  onSubmit: () => void;
}

export function AssignRosterDialog({
  open,
  onOpenChange,
  rosterEmp,
  onRosterEmpChange,
  rosterShift,
  onRosterShiftChange,
  rosterDay,
  onRosterDayChange,
  onSubmit,
}: AssignRosterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Assign Shift Roster</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Employee *</Label>
            <Input
              placeholder="Enter employee name..."
              value={rosterEmp}
              onChange={(e) => onRosterEmpChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Shift</Label>
            <Select value={rosterShift} onValueChange={onRosterShiftChange}>
              <SelectTrigger className="text-xs bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHIFT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Day of Week</Label>
            <Select value={rosterDay} onValueChange={onRosterDayChange}>
              <SelectTrigger className="text-xs bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OF_WEEK_OPTIONS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            size="sm"
            onClick={onSubmit}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            Assign Roster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
