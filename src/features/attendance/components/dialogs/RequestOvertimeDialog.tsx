import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { OVERTIME_MULTIPLIER_OPTIONS } from "../../constants/attendance.constants";

interface RequestOvertimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otHours: string;
  onOtHoursChange: (val: string) => void;
  otMultiplier: string;
  onOtMultiplierChange: (val: string) => void;
  otReason: string;
  onOtReasonChange: (val: string) => void;
  onSubmit: () => void;
}

export function RequestOvertimeDialog({
  open,
  onOpenChange,
  otHours,
  onOtHoursChange,
  otMultiplier,
  onOtMultiplierChange,
  otReason,
  onOtReasonChange,
  onSubmit,
}: RequestOvertimeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Request Overtime (OT) Approval
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Overtime Hours *</Label>
              <Input
                type="number"
                step="0.5"
                value={otHours}
                onChange={(e) => onOtHoursChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Pay Multiplier</Label>
              <Select value={otMultiplier} onValueChange={onOtMultiplierChange}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OVERTIME_MULTIPLIER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Business Justification *</Label>
            <Textarea
              placeholder="Explain business need for overtime (e.g. Critical release production deployment)..."
              value={otReason}
              onChange={(e) => onOtReasonChange(e.target.value)}
              rows={3}
              className="text-xs bg-secondary/30"
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            size="sm"
            onClick={onSubmit}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            Submit OT Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
