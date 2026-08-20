import { motion } from "framer-motion";
import { Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayrollContext } from "../PayrollContext";

export function OvertimeTab() {
  const {
    isOvertimeLoading,
    overtimeList,
    fmt,
    handleApproveOvertime,
    isApprovingOvertime,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Overtime (OT) Payout Approval Queue</h2>
          <p className="text-xs text-muted-foreground">Approve 1.5x / 2.0x hourly rates for extra hours worked.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">OT Hours</TableHead>
              <TableHead className="text-xs font-bold">Rate Multiplier</TableHead>
              <TableHead className="text-xs font-bold">Calculated Payout</TableHead>
              <TableHead className="text-xs font-bold">Period</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isOvertimeLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Loading overtime queue from attendance sync...</p>
                </TableCell>
              </TableRow>
            ) : overtimeList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <Timer className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No overtime payouts queued</p>
                  <p className="text-[11px]">Approved overtime hours from the Attendance module will sync here for payout.</p>
                </TableCell>
              </TableRow>
            ) : (
              overtimeList.map((o: any) => {
                const st = o.status?.toLowerCase() || "pending";
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {o.employee_name || o.employeeName || "Employee"}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-primary">
                      +{o.hours} hrs
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {o.rate_multiplier ? `${o.rate_multiplier}x` : o.rateMultiplier || "1.5x"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-emerald-500">
                      {fmt(o.calculated_amount || o.totalPayout || 3750)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{o.date || o.month || "June 2026"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          st === "paid" || st === "approved"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-amber-500/15 text-amber-500"
                        }
                      >
                        {o.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {st === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApproveOvertime(o.id)}
                          disabled={isApprovingOvertime}
                          className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10"
                        >
                          Approve Payout
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
