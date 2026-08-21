import { motion } from "framer-motion";
import { Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
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
import { AttendanceFilters } from "../AttendanceFilters";
import { AttendanceTable } from "../AttendanceTable";
import type { RegularizationRequest } from "../../types/attendance.types";

interface RegularizationTabProps {
  regularizations: RegularizationRequest[];
  filteredRegularizations: RegularizationRequest[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterStatus: string;
  onStatusChange: (val: string) => void;
  onResetFilters: () => void;
  onOpenApplyRegularization: () => void;
  onUpdateStatus: (
    id: string,
    status: string,
    approverName?: string,
    reviewComment?: string
  ) => void;
  currentUserName?: string;
}

export function RegularizationTab({
  filteredRegularizations,
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  onResetFilters,
  onOpenApplyRegularization,
  onUpdateStatus,
  currentUserName = "HR Admin",
}: RegularizationTabProps) {
  return (
    <motion.div
      key="regularization"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Attendance Regularization Requests
          </h2>
          <p className="text-xs text-muted-foreground">
            Request retroactive punch fixes for missed swipes or system issues.
          </p>
        </div>
        <Button
          onClick={onOpenApplyRegularization}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Apply for Regularization
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <AttendanceFilters
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onStatusChange={onStatusChange}
        onReset={onResetFilters}
      />

      <AttendanceTable>
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Missed Punch</TableHead>
              <TableHead className="text-xs font-bold">Requested Time</TableHead>
              <TableHead className="text-xs font-bold">Justification</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Manager Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegularizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <CheckCircle className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">
                    No regularization requests found
                  </p>
                  <p className="text-[11px]">
                    Click "+ Apply for Regularization" to submit missed punch requests.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRegularizations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {r.employeeName}
                    <span className="block text-[10px] text-muted-foreground font-mono">
                      {r.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{r.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {r.missedPunchType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-primary">
                    {r.requestedTime}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    <span className="truncate block" title={r.reason}>
                      {r.reason}
                    </span>
                    {r.reviewComment && (
                      <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">
                        Note: {r.reviewComment}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        r.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : r.status === "Rejected"
                          ? "bg-destructive/15 text-destructive border-destructive/30"
                          : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                      }
                    >
                      {r.status}
                    </Badge>
                    {r.approverName && (
                      <span className="text-[9px] text-muted-foreground block mt-0.5 font-mono">
                        By {r.approverName}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onUpdateStatus(
                              r.id,
                              "Approved",
                              currentUserName,
                              "Verified & Approved by HR"
                            );
                            toast.success(
                              `Regularization approved! Attendance punch recorded for ${r.employeeName}`
                            );
                          }}
                          className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10 font-bold"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onUpdateStatus(
                              r.id,
                              "Rejected",
                              currentUserName,
                              "Insufficient justification"
                            );
                            toast.error("Regularization request rejected.");
                          }}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10 font-bold"
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
