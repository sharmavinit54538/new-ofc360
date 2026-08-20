import { motion } from "framer-motion";
import { Plus, Loader2, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayrollContext } from "../PayrollContext";

export function AdvancesTab() {
  const {
    setIsAdvModalOpen,
    isAdvancesLoading,
    advancesList,
    fmt,
    handleApproveAdvance,
    isApprovingAdvance,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Salary Advances & Loan Recovery Engine</h2>
          <p className="text-xs text-muted-foreground">Track employee emergency advance requests and monthly EMI auto-deductions.</p>
        </div>
        <Button onClick={() => setIsAdvModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Request Salary Advance
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Loan Amount</TableHead>
              <TableHead className="text-xs font-bold">Tenure (EMI)</TableHead>
              <TableHead className="text-xs font-bold">Monthly Deduction</TableHead>
              <TableHead className="text-xs font-bold">Balance Remaining</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdvancesLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Fetching advance loan requests...</p>
                </TableCell>
              </TableRow>
            ) : advancesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <Handshake className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No active salary advances or loans</p>
                  <p className="text-[11px]">Click "+ Request Salary Advance" to apply for emergency loan approval.</p>
                </TableCell>
              </TableRow>
            ) : (
              advancesList.map((a: any) => {
                const st = a.status?.toLowerCase() || "pending";
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {a.employee_name || a.employeeName || "Employee"}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-primary">
                      {fmt(a.principal_amount || a.requestedAmount || 50000)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {a.tenure_months || a.emiMonths || 6} months
                    </TableCell>
                    <TableCell className="text-xs font-mono text-destructive">
                      {fmt(a.monthly_repayment || a.monthlyEmi || 8333)}/mo
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold">
                      {fmt(a.remaining_balance || a.balanceRemaining || 50000)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          st === "active" || st === "active emi" || st === "approved"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-amber-500/15 text-amber-500"
                        }
                      >
                        {a.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {st === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApproveAdvance(a.id)}
                          disabled={isApprovingAdvance}
                          className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10"
                        >
                          Approve Loan
                        </Button>
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
