import { motion } from "framer-motion";
import { Plus, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceEmptyState } from "../AttendanceEmptyState";
import type { ShiftTemplate } from "../../types/attendance.types";

interface ShiftsTabProps {
  shifts: ShiftTemplate[];
  onOpenAddShift: () => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftsTab({
  shifts,
  onOpenAddShift,
  onDeleteShift,
}: ShiftsTabProps) {
  return (
    <motion.div
      key="shifts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Shift Templates & Policies</h2>
          <p className="text-xs text-muted-foreground">
            Configure shift timings, grace periods, and half-day cutoffs.
          </p>
        </div>
        <Button
          onClick={onOpenAddShift}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Shift Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map((s) => (
          <div
            key={s.id}
            className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">{s.name}</h3>
              <Badge variant="outline" className="text-[10px] font-mono">
                {s.department}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-secondary/30 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Timings</span>
                <span className="font-mono font-bold text-foreground">
                  {s.startTime} - {s.endTime}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Grace Window</span>
                <span className="font-mono font-bold text-primary">
                  {s.gracePeriodMins} mins
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Full Day Min</span>
                <span className="font-mono text-foreground">{s.fullDayHours} hrs</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Break Window</span>
                <span className="font-mono text-foreground">{s.breakDurationMins} mins</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteShift(s.id)}
                className="h-8 text-destructive text-xs gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {shifts.length === 0 && (
        <AttendanceEmptyState
          icon={Sun}
          title="No Shift Templates Defined"
          description="Click '+ Add Shift Template' to build custom working schedules."
        />
      )}
    </motion.div>
  );
}
