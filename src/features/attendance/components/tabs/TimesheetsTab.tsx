import { motion } from "framer-motion";
import { Plus, Timer } from "lucide-react";
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
import type { DisplayedTimesheet } from "../../types/attendance.types";

interface TimesheetsTabProps {
  displayedTimesheets: DisplayedTimesheet[];
  onOpenLogTimesheet: () => void;
  onApproveTimesheet: (id: string) => void;
}

export function TimesheetsTab({
  displayedTimesheets,
  onOpenLogTimesheet,
  onApproveTimesheet,
}: TimesheetsTabProps) {
  return (
    <motion.div
      key="timesheets"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Project Timesheets & Client Hours
          </h2>
          <p className="text-xs text-muted-foreground">
            Log billable project time, tasks and submit weekly timesheets.
          </p>
        </div>
        <Button
          onClick={onOpenLogTimesheet}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log Project Time
        </Button>
      </div>

      <AttendanceTable>
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Project</TableHead>
              <TableHead className="text-xs font-bold">Task Details</TableHead>
              <TableHead className="text-xs font-bold">Logged Hours</TableHead>
              <TableHead className="text-xs font-bold">Billing Type</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTimesheets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <Timer className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No project timesheets logged</p>
                  <p className="text-[11px]">
                    Click "+ Log Project Time" to start tracking billable hours.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              displayedTimesheets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {t.employeeName}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-primary">
                    {t.projectName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {t.taskDescription}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold">
                    {t.loggedHours} hrs
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {t.billable ? "Billable" : "Internal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        t.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-amber-500/15 text-amber-500"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {t.status === "Submitted" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApproveTimesheet(t.id)}
                        className="h-7 text-xs text-emerald-500 font-bold"
                      >
                        Approve
                      </Button>
                    )}
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
