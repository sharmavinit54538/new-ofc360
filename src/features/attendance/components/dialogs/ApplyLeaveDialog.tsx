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
import { LEAVE_TYPE_OPTIONS } from "../../constants/attendance.constants";

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType: string;
  onLeaveTypeChange: (val: string) => void;
  leaveStart: string;
  onLeaveStartChange: (val: string) => void;
  leaveEnd: string;
  onLeaveEndChange: (val: string) => void;
  leaveReason: string;
  onLeaveReasonChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  leaveType,
  onLeaveTypeChange,
  leaveStart,
  onLeaveStartChange,
  leaveEnd,
  onLeaveEndChange,
  leaveReason,
  onLeaveReasonChange,
  isLoading,
  onSubmit,
}: ApplyLeaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Apply for Leave / Time-Off</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Leave Type</Label>
            <Select value={leaveType} onValueChange={onLeaveTypeChange}>
              <SelectTrigger className="text-xs bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Start Date *</Label>
              <Input
                type="date"
                value={leaveStart}
                onChange={(e) => onLeaveStartChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">End Date *</Label>
              <Input
                type="date"
                value={leaveEnd}
                onChange={(e) => onLeaveEndChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Reason *</Label>
            <Textarea
              placeholder="State reason for absence..."
              value={leaveReason}
              onChange={(e) => onLeaveReasonChange(e.target.value)}
              rows={3}
              className="text-xs bg-secondary/30"
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isLoading}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            {isLoading ? "Submitting..." : "Submit Leave Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
