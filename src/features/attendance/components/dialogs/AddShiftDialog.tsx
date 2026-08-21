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
import { DEPARTMENT_OPTIONS } from "../../constants/attendance.constants";

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftName: string;
  onShiftNameChange: (val: string) => void;
  shiftStart: string;
  onShiftStartChange: (val: string) => void;
  shiftEnd: string;
  onShiftEndChange: (val: string) => void;
  shiftGrace: string;
  onShiftGraceChange: (val: string) => void;
  shiftDept: string;
  onShiftDeptChange: (val: string) => void;
  onSubmit: () => void;
}

export function AddShiftDialog({
  open,
  onOpenChange,
  shiftName,
  onShiftNameChange,
  shiftStart,
  onShiftStartChange,
  shiftEnd,
  onShiftEndChange,
  shiftGrace,
  onShiftGraceChange,
  shiftDept,
  onShiftDeptChange,
  onSubmit,
}: AddShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Add Shift Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Shift Name *</Label>
            <Input
              placeholder="e.g. Night Shift [9PM - 6AM]"
              value={shiftName}
              onChange={(e) => onShiftNameChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Start Time</Label>
              <Input
                type="time"
                value={shiftStart}
                onChange={(e) => onShiftStartChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">End Time</Label>
              <Input
                type="time"
                value={shiftEnd}
                onChange={(e) => onShiftEndChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Grace Window (Mins)</Label>
              <Input
                type="number"
                value={shiftGrace}
                onChange={(e) => onShiftGraceChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={shiftDept} onValueChange={onShiftDeptChange}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            size="sm"
            onClick={onSubmit}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            Save Shift Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
