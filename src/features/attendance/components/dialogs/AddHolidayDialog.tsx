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
  HOLIDAY_TYPES,
  BRANCH_OPTIONS,
} from "../../constants/attendance.constants";
import type { HolidayItem } from "../../types/attendance.types";

interface AddHolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holidayTitle: string;
  onHolidayTitleChange: (val: string) => void;
  holidayDate: string;
  onHolidayDateChange: (val: string) => void;
  holidayType: HolidayItem["type"];
  onHolidayTypeChange: (val: HolidayItem["type"]) => void;
  holidayBranch: string;
  onHolidayBranchChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function AddHolidayDialog({
  open,
  onOpenChange,
  holidayTitle,
  onHolidayTitleChange,
  holidayDate,
  onHolidayDateChange,
  holidayType,
  onHolidayTypeChange,
  holidayBranch,
  onHolidayBranchChange,
  isLoading,
  onSubmit,
}: AddHolidayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Add Company Holiday</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Holiday Title *</Label>
            <Input
              placeholder="e.g. Independence Day"
              value={holidayTitle}
              onChange={(e) => onHolidayTitleChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Date *</Label>
            <Input
              type="date"
              value={holidayDate}
              onChange={(e) => onHolidayDateChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Holiday Type</Label>
              <Select value={holidayType} onValueChange={onHolidayTypeChange}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOLIDAY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Branch</Label>
              <Select value={holidayBranch} onValueChange={onHolidayBranchChange}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Headquarters (HQ)">All Branches (HQ)</SelectItem>
                  {BRANCH_OPTIONS.filter((b) => b !== "Headquarters (HQ)").map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
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
            disabled={isLoading}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            {isLoading ? "Saving..." : "Add Holiday"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
