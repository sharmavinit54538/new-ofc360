import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function PayslipRow({ p }: { p: any }) {
  const c = usePayrollContext();
  const period = p.pay_period_start ? `${p.pay_period_start} to ${p.pay_period_end}` : `${p.month || "June"} ${p.year || 2026}`;
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{p.employee_name || p.employeeName || "Employee"}</TableCell>
      <TableCell className="text-xs font-mono">{period}</TableCell>
      <TableCell className="text-xs font-mono">{c.fmt(p.gross_pay || (p.basic || 0) + (p.hra || 0) || 75000)}</TableCell>
      <TableCell className="text-xs font-mono text-destructive">-{c.fmt(p.total_deductions || (p.pfDeduction || 0) + (p.tdsDeduction || 0) || 8500)}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-emerald-500">{c.fmt(p.net_pay || p.netSalary || 66500)}</TableCell>
      <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => c.handleDownloadPayslip(p.id, p.employee_name || p.employeeName)} className="h-7 text-xs gap-1 border-border/60"><Download className="w-3 h-3" /> PDF</Button></TableCell>
    </TableRow>
  );
}
