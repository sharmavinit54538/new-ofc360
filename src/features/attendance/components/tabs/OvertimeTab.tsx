import { motion } from "framer-motion";
import { Plus, Award } from "lucide-react";
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
import type { OvertimeEntry } from "../../types/attendance.types";

interface OvertimeTabProps {
  overtimes: OvertimeEntry[];
  onOpenRequestOvertime: () => void;
  onApproveOvertime: (id: string) => void;
}

export function OvertimeTab({
  overtimes,
  onOpenRequestOvertime,
  onApproveOvertime,
}: OvertimeTabProps) {
  return (
    <motion.div
      key="overtime"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Overtime (OT) Tracking & Approvals
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor extra working hours with 1.5x / 2.0x multiplier approval for payroll.
          </p>
        </div>
        <Button
          onClick={onOpenRequestOvertime}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" /> Request OT Sign-off
        </Button>
      </div>

      <AttendanceTable>
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Shift Standard</TableHead>
              <TableHead className="text-xs font-bold">Actual Logged</TableHead>
              <TableHead className="text-xs font-bold">OT Hours</TableHead>
              <TableHead className="text-xs font-bold">Multiplier Rate</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overtimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs">
                  <Award className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No overtime hours logged</p>
                  <p className="text-[11px]">
                    Overtime hours logged beyond shift schedules will appear here for manager
                    approval.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              overtimes.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {o.employeeName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">{o.date}</TableCell>
                  <TableCell className="text-xs font-mono">{o.standardHours}h</TableCell>
                  <TableCell className="text-xs font-mono font-bold text-foreground">
                    {o.actualHours}h
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-primary">
                    +{o.overtimeHours}h
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {o.rateMultiplier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        o.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-amber-500/15 text-amber-500"
                      }
                    >
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {o.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApproveOvertime(o.id)}
                        className="h-7 text-xs text-emerald-500 font-bold"
                      >
                        Approve OT
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
