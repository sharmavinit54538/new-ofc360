import { motion } from "framer-motion";
import { Plus, Loader2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayrollContext } from "../PayrollContext";

export function BonusesTab() {
  const {
    setIsBonusModalOpen,
    isBonusesLoading,
    bonusesList,
    fmt,
    handleApproveBonus,
    isApprovingBonus,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Bonuses, Commissions & Incentives</h2>
          <p className="text-xs text-muted-foreground">Performance rewards, festival bonuses, and sales commissions.</p>
        </div>
        <Button onClick={() => setIsBonusModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Add Bonus Payout
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Reward Category</TableHead>
              <TableHead className="text-xs font-bold">Amount</TableHead>
              <TableHead className="text-xs font-bold">Payout Period</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isBonusesLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Fetching bonuses from database...</p>
                </TableCell>
              </TableRow>
            ) : bonusesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <Gift className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No bonus entries added</p>
                  <p className="text-[11px]">Click "+ Add Bonus Payout" to assign performance rewards.</p>
                </TableCell>
              </TableRow>
            ) : (
              bonusesList.map((b: any) => {
                const st = b.status?.toLowerCase() || "pending";
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {b.employee_name || b.employeeName || "Employee"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary text-[10px] font-bold">
                        {b.title || b.type || b.bonus_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-emerald-500">
                      {fmt(b.amount)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{b.month || "June 2026"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          st === "paid" || st === "approved"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-amber-500/15 text-amber-500"
                        }
                      >
                        {b.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {st === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApproveBonus(b.id)}
                          disabled={isApprovingBonus}
                          className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10"
                        >
                          Approve
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
