import { TableBody } from "@/components/ui/table";
import { Loader2, Receipt } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { ReimbursementRow } from "./ReimbursementRow";

export function ReimbursementsTableBody() {
  const { isReimbursementsLoading, reimbursementsList } = usePayrollContext();
  if (isReimbursementsLoading) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  }
  if (reimbursementsList.length === 0) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-xs"><Receipt className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No reimbursement claims submitted</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {reimbursementsList.map((r: any) => <ReimbursementRow key={r.id} r={r} />)}
    </TableBody>
  );
}
