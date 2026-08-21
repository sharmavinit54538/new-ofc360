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

interface LogTimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tsProject: string;
  onTsProjectChange: (val: string) => void;
  tsTask: string;
  onTsTaskChange: (val: string) => void;
  tsHours: string;
  onTsHoursChange: (val: string) => void;
  tsBillable: boolean;
  onTsBillableChange: (val: boolean) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function LogTimesheetDialog({
  open,
  onOpenChange,
  tsProject,
  onTsProjectChange,
  tsTask,
  onTsTaskChange,
  tsHours,
  onTsHoursChange,
  tsBillable,
  onTsBillableChange,
  isLoading,
  onSubmit,
}: LogTimesheetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Log Project Timesheet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Project Name *</Label>
            <Input
              placeholder="e.g. OFC360 Mobile App 2.0"
              value={tsProject}
              onChange={(e) => onTsProjectChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Task Description *</Label>
            <Input
              placeholder="e.g. Developed Biometric Auth API endpoints"
              value={tsTask}
              onChange={(e) => onTsTaskChange(e.target.value)}
              className="text-xs bg-secondary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Logged Hours</Label>
              <Input
                type="number"
                step="0.5"
                value={tsHours}
                onChange={(e) => onTsHoursChange(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Billing</Label>
              <Select
                value={tsBillable ? "yes" : "no"}
                onValueChange={(v) => onTsBillableChange(v === "yes")}
              >
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Billable Client Work</SelectItem>
                  <SelectItem value="no">Internal Non-Billable</SelectItem>
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
            {isLoading ? "Submitting..." : "Submit Timesheet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
