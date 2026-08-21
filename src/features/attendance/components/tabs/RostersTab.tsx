import { motion } from "framer-motion";
import { Plus, CalendarDays, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceTable } from "../AttendanceTable";
import type { RosterItem } from "../../types/attendance.types";

interface RostersTabProps {
  rosters: RosterItem[];
  onOpenAssignRoster: () => void;
  onDeleteRoster: (id: string) => void;
}

export function RostersTab({
  rosters,
  onOpenAssignRoster,
  onDeleteRoster,
}: RostersTabProps) {
  return (
    <motion.div
      key="rosters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Weekly Roster & Shift Scheduling Matrix
          </h2>
          <p className="text-xs text-muted-foreground">
            Assign, swap and balance departmental shift rosters.
          </p>
        </div>
        <Button
          onClick={onOpenAssignRoster}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" /> Assign Shift Roster
        </Button>
      </div>

      <AttendanceTable>
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Department</TableHead>
              <TableHead className="text-xs font-bold">Assigned Shift</TableHead>
              <TableHead className="text-xs font-bold">Timing Window</TableHead>
              <TableHead className="text-xs font-bold">Day of Week</TableHead>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rosters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <CalendarDays className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No shift rosters assigned yet</p>
                  <p className="text-[11px]">
                    Click "+ Assign Shift Roster" to allocate shifts to employees.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rosters.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {r.employeeName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.department}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary text-[10px] font-bold">
                      {r.shiftName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{r.timing}</TableCell>
                  <TableCell className="text-xs font-semibold">{r.dayOfWeek}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {r.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteRoster(r.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AttendanceTable>
    </motion.div>
  );
}
