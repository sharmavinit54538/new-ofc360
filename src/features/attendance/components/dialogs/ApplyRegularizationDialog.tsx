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
import { REGULARIZATION_PUNCH_TYPES } from "../../constants/attendance.constants";
import type { RegularizationRequest } from "../../types/attendance.types";

interface ApplyRegularizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regDate: string;
  onRegDateChange: (val: string) => void;
  regType: RegularizationRequest["missedPunchType"];
  onRegTypeChange: (val: RegularizationRequest["missedPunchType"]) => void;
  regTime: string;
  onRegTimeChange: (val: string) => void;
  regReason: string;
  onRegReasonChange: (val: string) => void;
  onSubmit: () => void;
}

export function ApplyRegularizationDialog({
  open,
  onOpenChange,
  regDate,
  onRegDateChange,
  regType,
  onRegTypeChange,
  regTime,
  onRegTimeChange,
  regReason,
  onRegReasonChange,
  onSubmit,
}: ApplyRegularizationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Apply for Attendance Regularization
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Missed Date *</Label>
              <Input
                type="date"
                value={regDate}
                onChange={(e) => onRegDateChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Correct Punch Time</Label>
              <Input
                type="time"
                value={regTime}
                onChange={(e) => onRegTimeChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Missed Punch Type</Label>
            <Select value={regType} onValueChange={onRegTypeChange}>
              <SelectTrigger className="text-xs bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGULARIZATION_PUNCH_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Reason / Justification *</Label>
            <Textarea
              placeholder="Explain why the punch was missed (e.g. client on-site visit, biometric sensor offline)..."
              value={regReason}
              onChange={(e) => onRegReasonChange(e.target.value)}
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
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
