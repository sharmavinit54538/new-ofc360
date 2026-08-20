import { TableBody } from "@/components/ui/table";
import { Landmark, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { BankTransferRow } from "./BankTransferRow";

export function BankTransfersTableBody() {
  const { isBankTransfersLoading, bankTransfersList } = usePayrollContext();
  if (isBankTransfersLoading) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading transfers...</p></td></tr></TableBody>;
  }
  if (bankTransfersList.length === 0) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-xs"><Landmark className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No bank advice files generated</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {bankTransfersList.map((b: any) => <BankTransferRow key={b.id} b={b} />)}
    </TableBody>
  );
}
