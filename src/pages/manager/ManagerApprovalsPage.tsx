import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, CheckCircle2, XCircle, Clock, Calendar, AlertCircle } from "lucide-react";
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
import { useLeaveStore } from "@/stores/leaveStore";
import { toast } from "sonner";

export default function ManagerApprovalsPage() {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveStore();
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");

  const filteredRequests = leaveRequests.filter((r) => {
    if (filter === "All") return true;
    return r.status === filter;
  });

  const handleApprove = (id: string, name: string) => {
    approveLeaveRequest(id);
    toast.success(`Approved leave request for ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    rejectLeaveRequest(id);
    toast.error(`Rejected leave request for ${name}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span>Team Approvals Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review and approve time-off applications, expenses, and request workflows for your team.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50">
          {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === f
                  ? "bg-card text-primary font-bold shadow-xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Pending & Processed Approvals</h3>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No {filter.toLowerCase()} approvals found</p>
            <p className="text-xs text-muted-foreground">Team leave and expense requests requiring your review will appear here.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Employee Name</TableHead>
                  <TableHead className="text-xs font-bold">Request Type</TableHead>
                  <TableHead className="text-xs font-bold">Dates / Duration</TableHead>
                  <TableHead className="text-xs font-bold">Reason</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-right text-xs font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-bold text-xs text-foreground">{req.employeeName}</TableCell>
                    <TableCell className="text-xs font-semibold">{req.type}</TableCell>
                    <TableCell className="text-xs font-mono">{req.startDate} to {req.endDate}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{req.reason}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          req.status === "Approved"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : req.status === "Rejected"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-500/15 text-amber-500"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id, req.employeeName)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(req.id, req.employeeName)}
                            className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 font-semibold"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
