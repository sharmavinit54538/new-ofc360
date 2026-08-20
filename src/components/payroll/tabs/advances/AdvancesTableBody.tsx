import { TableBody } from "@/components/ui/table";
import { Coins, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { AdvanceRow } from "./AdvanceRow";

export function AdvancesTableBody() {
  const { isAdvancesLoading, advancesList } = usePayrollContext();
  if (isAdvancesLoading) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  }
  if (advancesList.length === 0) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-xs"><Coins className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No advance requests registered</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {advancesList.map((a: any) => <AdvanceRow key={a.id} a={a} />)}
    </TableBody>
  );
}
