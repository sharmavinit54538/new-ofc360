import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function BonusRow({ b }: { b: any }) {
  const c = usePayrollContext(), st = b.status?.toLowerCase() || "pending", badgeClass = st === "approved" || st === "paid" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500";
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{b.employee_name || b.employeeName || "Employee"}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{b.bonus_type || b.bonusType || "Performance"}</Badge></TableCell>
      <TableCell className="text-xs text-muted-foreground">{b.title || b.plan_name}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-emerald-500">{c.fmt(b.amount)}</TableCell>
      <TableCell><Badge className={badgeClass}>{b.status || "Pending"}</Badge></TableCell>
      <TableCell className="text-right">{st === "pending" && <Button size="sm" variant="ghost" onClick={() => c.handleApproveBonus(b.id)} disabled={c.isApprovingBonus} className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10">Approve</Button>}</TableCell>
    </TableRow>
  );
}
