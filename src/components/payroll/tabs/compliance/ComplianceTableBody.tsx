import { TableBody } from "@/components/ui/table";
import { ShieldAlert, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { ComplianceRow } from "./ComplianceRow";

export function ComplianceTableBody() {
  const { isComplianceLoading, complianceList } = usePayrollContext();
  if (isComplianceLoading) {
    return <TableBody><tr><td colSpan={5} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading policies...</p></td></tr></TableBody>;
  }
  if (complianceList.length === 0) {
    return <TableBody><tr><td colSpan={5} className="text-center py-12 text-muted-foreground text-xs"><ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No compliance rules registered</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {complianceList.map((c: any) => <ComplianceRow key={c.id} c={c} />)}
    </TableBody>
  );
}
