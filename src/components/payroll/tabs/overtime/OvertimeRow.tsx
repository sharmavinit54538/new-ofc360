import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function OvertimeRow({ o }: { o: any }) {
  const c = usePayrollContext(), st = o.status?.toLowerCase() || "pending", badgeClass = st === "approved" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500";
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{o.employee_name || "Employee"}</TableCell>
      <TableCell className="text-xs font-mono">{o.date || "2026-06-12"}</TableCell>
      <TableCell className="text-xs font-mono font-bold">{o.hours} Hours</TableCell>
      <TableCell className="text-xs font-mono">{o.rate_multiplier || 1.5}x Base</TableCell>
      <TableCell className="text-xs font-mono font-bold text-primary">{c.fmt(o.calculated_amount)}</TableCell>
      <TableCell><Badge className={badgeClass}>{o.status || "Pending"}</Badge></TableCell>
      <TableCell className="text-right">{st === "pending" && <Button size="sm" variant="ghost" onClick={() => c.handleApproveOvertime(o.id)} disabled={c.isApprovingOvertime} className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10">Approve</Button>}</TableCell>
    </TableRow>
  );
}
