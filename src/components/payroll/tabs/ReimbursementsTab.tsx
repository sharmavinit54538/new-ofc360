import { motion } from "framer-motion";
import { Plus, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayrollContext } from "../PayrollContext";

export function ReimbursementsTab() {
  const {
    setIsReimbModalOpen,
    isReimbursementsLoading,
    reimbursementsList,
    fmt,
    handleApproveReimbursement,
    isApprovingReimb,
    handleRejectReimbursement,
    isRejectingReimb,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Expense Claims & Tax-Free Reimbursements</h2>
          <p className="text-xs text-muted-foreground">Review fuel, internet, and travel claims for non-taxable payout.</p>
        </div>
        <Button onClick={() => setIsReimbModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Submit Expense Claim
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">Description</TableHead>
              <TableHead className="text-xs font-bold">Claim Amount</TableHead>
              <TableHead className="text-xs font-bold">Submitted Date</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isReimbursementsLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Loading reimbursement claims...</p>
                </TableCell>
              </TableRow>
            ) : reimbursementsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <Receipt className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No reimbursement claims submitted</p>
                  <p className="text-[11px]">Click "+ Submit Expense Claim" to upload expense bills.</p>
                </TableCell>
              </TableRow>
            ) : (
              reimbursementsList.map((r: any) => {
                const st = r.status?.toLowerCase() || "pending";
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {r.employee_name || r.employeeName || "Employee"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {r.remarks || r.description}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-primary">
                      {fmt(r.amount)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {r.expense_date || r.submittedAt || r.created_at || "2026-06-15"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          st === "approved"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : st === "rejected"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-500/15 text-amber-500"
                        }
                      >
                        {r.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {st === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApproveReimbursement(r.id)}
                            disabled={isApprovingReimb}
                            className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRejectReimbursement(r.id)}
                            disabled={isRejectingReimb}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
