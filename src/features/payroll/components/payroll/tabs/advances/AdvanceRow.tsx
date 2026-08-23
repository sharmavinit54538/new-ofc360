import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function AdvanceRow({ a }: { a: any }) {
  const c = usePayrollContext(), st = a.status?.toLowerCase() || "pending", badgeClass = st === "active" || st === "completed" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500";
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{a.employee_name || a.employeeName || "Employee"}</TableCell>
      <TableCell className="text-xs font-mono">{c.fmt(a.principal_amount)}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-destructive">-{c.fmt(a.monthly_repayment)}</TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground font-bold">{c.fmt(a.remaining_balance)}</TableCell>
      <TableCell className="text-xs font-mono font-bold">{a.tenure_months} M</TableCell>
      <TableCell><Badge className={badgeClass}>{a.status || "Pending"}</Badge></TableCell>
      <TableCell className="text-right">{st === "pending" && <Button size="sm" variant="ghost" onClick={() => c.handleApproveAdvance(a.id)} disabled={c.isApprovingAdvance} className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10">Approve</Button>}</TableCell>
    </TableRow>
  );
}
