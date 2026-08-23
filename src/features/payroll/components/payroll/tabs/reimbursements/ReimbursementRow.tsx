import { TableCell, TableRow } from "@/components/ui/table"; import { Badge } from "@/components/ui/badge";
import { ReimbursementActions } from "./ReimbursementActions"; import { usePayrollContext } from "../../PayrollContext";

export function ReimbursementRow({ r }: { r: any }) {
  const c = usePayrollContext(), st = r.status?.toLowerCase() || "pending";
  const bg = st === "approved" ? "bg-emerald-500/15 text-emerald-500" : st === "rejected" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-500";
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{r.employee_name || r.employeeName || "Employee"}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{r.category}</Badge></TableCell>
      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{r.remarks || r.description}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-primary">{c.fmt(r.amount)}</TableCell>
      <TableCell className="text-xs font-mono">{r.expense_date || r.submittedAt || r.created_at || "2026-06-15"}</TableCell>
      <TableCell><Badge className={bg}>{r.status || "Pending"}</Badge></TableCell>
      <TableCell className="text-right">{st === "pending" && <ReimbursementActions id={r.id} />}</TableCell>
    </TableRow>
  );
}
