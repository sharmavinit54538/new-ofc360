import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileText, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { PayslipRow } from "./PayslipRow";

export function PayslipsTableBody() {
  const { isPayslipsLoading, payslipsList } = usePayrollContext();
  if (isPayslipsLoading) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  }
  if (payslipsList.length === 0) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-xs"><FileText className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No payslips generated for this period</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {payslipsList.map((p: any) => <PayslipRow key={p.id} p={p} />)}
    </TableBody>
  );
}
