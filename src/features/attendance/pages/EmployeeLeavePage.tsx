import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeaveStore } from "@/stores/leaveStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function EmployeeLeavePage() {
  const { leaveRequests, addLeaveRequest, cancelLeaveRequest } = useLeaveStore();
  const { user } = useAuth();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<"Paid Leave" | "Casual Leave" | "Sick Leave">("Casual Leave");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");

  // Filter requests belonging ONLY to current logged-in employee
  const myLeaveRequests = leaveRequests.filter(
    (l) => l.employeeName === user?.name || l.employeeId === user?.id
  );

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave request.");
      return;
    }

    addLeaveRequest({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Employee Self-Service",
      type: leaveType,
      startDate,
      endDate,
      days: 1,
      reason: reason.trim(),
      status: "Pending",
    });

    setReason("");
    setIsApplyModalOpen(false);
    toast.success("Leave request submitted for manager approval!");
  };

  const handleCancelRequest = (id: string) => {
    cancelLeaveRequest(id);
    toast.success("Pending leave request cancelled.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>My Leave & Time-Off Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View personal leave balances, submit leave applications, and track approval status.
          </p>
        </div>

        <Button
          onClick={() => setIsApplyModalOpen(true)}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Paid Earned Leave (PL)</span>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">12 Days</p>
          <span className="text-[11px] text-muted-foreground">Available Balance</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Casual Leave (CL)</span>
          <p className="text-2xl font-extrabold text-primary font-mono">6 Days</p>
          <span className="text-[11px] text-muted-foreground">Available Balance</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Sick Leave (SL)</span>
          <p className="text-2xl font-extrabold text-amber-500 font-mono">4 Days</p>
          <span className="text-[11px] text-muted-foreground">Available Balance</span>
        </div>
      </div>

      {/* My Leave Requests Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">My Leave Request History</h3>

        {myLeaveRequests.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No leave applications submitted yet</p>
            <p className="text-xs text-muted-foreground">Click "Apply for Leave" to request time off from your manager.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Leave Type</TableHead>
                  <TableHead className="text-xs font-bold">Start Date</TableHead>
                  <TableHead className="text-xs font-bold">End Date</TableHead>
                  <TableHead className="text-xs font-bold">Reason</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-right text-xs font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myLeaveRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-bold text-xs text-foreground">{req.type}</TableCell>
                    <TableCell className="text-xs font-mono">{req.startDate}</TableCell>
                    <TableCell className="text-xs font-mono">{req.endDate}</TableCell>
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
                      {req.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelRequest(req.id)}
                          className="h-7 text-xs text-destructive hover:text-destructive gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Submit Leave Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Leave Category</Label>
              <Select value={leaveType} onValueChange={(v: any) => setLeaveType(v)}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid Leave">Earned Paid Leave (PL)</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave (CL)</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave (SL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason for Leave *</Label>
              <Textarea
                placeholder="State your reason for leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="text-xs bg-secondary/30"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}