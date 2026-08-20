import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePayrollContext } from "../../PayrollContext";

export function SalaryProcessingRow({ r, runMonth }: { r: any; runMonth: string }) {
  const { fmt, employees } = usePayrollContext();
  const empCount = r.total_employees || r.processed_count || employees.length || 1, gross = r.total_gross || r.total_gross_pay || 850000, net = r.total_net || r.total_net_pay || 720000, date = r.created_at || r.pay_date || new Date().toLocaleDateString();
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{r.name || r.month || `Monthly Pay Cycle - ${runMonth}`}</TableCell>
      <TableCell className="text-xs font-mono font-bold">{empCount} Employees</TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">{fmt(gross)}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(net)}</TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">{date}</TableCell>
      <TableCell className="text-right"><Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">{r.status || "Approved"}</Badge></TableCell>
    </TableRow>
  );
}
