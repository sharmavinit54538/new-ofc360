import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
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
import type { DisplayedLeave } from "../../types/attendance.types";

interface LeavesTabProps {
  displayedLeaves: DisplayedLeave[];
  onOpenApplyLeave: () => void;
  onReviewLeave: (id: string, status: "Approved" | "Denied") => void;
}

export function LeavesTab({
  displayedLeaves,
  onOpenApplyLeave,
  onReviewLeave,
}: LeavesTabProps) {
  return (
    <motion.div
      key="leaves"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Leave Balances & Time-Off Requests
          </h2>
          <p className="text-xs text-muted-foreground">
            Apply for leaves and manage team absence balances.
          </p>
        </div>
        <Button
          onClick={onOpenApplyLeave}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </Button>
      </div>

      <AttendanceTable>
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Leave Category</TableHead>
              <TableHead className="text-xs font-bold">From - To</TableHead>
              <TableHead className="text-xs font-bold">Days</TableHead>
              <TableHead className="text-xs font-bold">Reason</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Manager Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <Calendar className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">
                    No leave applications submitted
                  </p>
                  <p className="text-[11px]">
                    Click "+ Apply for Leave" to create a time-off application.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              displayedLeaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {l.employeeName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {l.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {l.startDate} → {l.endDate}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold">
                    {l.days} day(s)
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.reason}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        l.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : l.status === "Rejected" || l.status === "Denied"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-amber-500/15 text-amber-500"
                      }
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {l.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onReviewLeave(l.id, "Approved")}
                          className="h-7 text-xs text-emerald-500 font-bold"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onReviewLeave(l.id, "Denied")}
                          className="h-7 text-xs text-destructive font-bold"
                        >
                          Reject
                        </Button>
                      </div>
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
